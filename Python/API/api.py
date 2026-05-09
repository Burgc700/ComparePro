'''
Imports that are used in this file.
'''
import urllib
import pyodbc
from flask import Flask, request
from extensions import db
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_cors import CORS
from flask_restful import marshal
from Models.Models import ProductsModel, PricesModel, CommentsModel, RecommendationModel, LikesModel
from Business.LikeService import LikesService
from Business.RecommendationsService import RecommendationsService
from Business.CommentService import CommentService


app = Flask(__name__)

CORS(app)

#region Connection
#Database parameters that connects the database to the api.
params = urllib.parse.quote_plus(
    r'DRIVER={ODBC Driver 17 for SQL Server};'
    r'SERVER=(localdb)\MSSQLLocalDB;'
    r'DATABASE=ComparePro;'
    r'Trusted_Connection=yes;'
    r'Encrypt=no;'  
)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mssql+pyodbc:///?odbc_connect={params}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)
#endregion

api = Api(app)

#region Products
#fields for the products table that correspond to the columns in the table.
productFields = {
    'id': fields.Integer,
    'name': fields.String,
    'brand': fields.String,
    'model_num': fields.String,
    'category': fields.String,
    'image': fields.String,
    'features': fields.String
}

'''
Get request to get all the products from the database.
'''
class Products(Resource):
    @marshal_with(productFields)
    def get(self):
        products = ProductsModel.query.all()
        return products

'''
Get request to get all products from a certain category of product.
'''    
class SortProductsByCategory(Resource):
        @marshal_with(productFields)
        def get(self, category):
            min_price = request.args.get("minPrice", type=float)
            min_rating = request.args.get("minRating", type=float)
            products = ProductsModel.query.filter_by(category=category)
            if min_price is not None or min_rating is not None:
                products = products.join(PricesModel)
                if min_price is not None:
                    products = products.filter(PricesModel.price >= min_price)
                if min_rating is not None:
                    products = products.filter(PricesModel.rating >= min_rating)
                products = products.distinct()
            return products.all()

'''
Get request to get a certain products information
'''        
class ProductByID(Resource):
    @marshal_with(productFields)
    def get(self,id):
        products = ProductsModel.query.get(id)
        if not products:
            abort(404, message="Product not found")
        return products
#endregion  

#region Search
#Adds the search parameter to the link when searching for a product.    
search_args = reqparse.RequestParser()
search_args.add_argument('q', type=str, required=True, location="args")

'''
Get request that finds all products that find the search criteria.
'''    
class SearchProducts(Resource):
    def get(self):
        args = search_args.parse_args()
        searchParam = args['q']
        if searchParam:
            results = ProductsModel.query.filter(
                (db.func.lower(ProductsModel.name).like(f"%{searchParam.lower()}%")) |
                (db.func.lower(ProductsModel.brand).like(f"%{searchParam.lower()}%")) |
                (db.func.lower(ProductsModel.features).like(f"%{searchParam.lower()}%"))
            ).all()
        return marshal(results, productFields), 200

#endregion    

#region Likes 
#Fields that correspond to the columns on the likes table of the database.
likeFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String
}

'''
Get request that finds the liked items from that user when the user logs in.
'''
class GetLikedItems(Resource):
    def get(self, user_id, product_id=None):
        if product_id:
            like = LikesModel.query.filter_by(user_id=user_id, product_id=product_id).first()
            return {"liked": like is not None}, 200
        else:
            likes = LikesModel.query.filter_by(user_id=user_id).all()
            likedItems = [like.product_id for like in likes]
            return likedItems, 200

'''
Post request to change whether a product is liked or not.
'''
class ToggleLikes(Resource):
    def post(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=str, required=True, location='json')
        product = ProductsModel.query.get(product_id)
        if not product:
            return {"message": "Invalid product id"}, 400
        args = parser.parse_args()
        liked = LikesService.toggle_likes(args['user_id'], product_id)
        if liked:
            return {'liked': True}, 201
        return {'liked': False}, 200
#endregion

#region Recommendations
#Fields that correspond the columns in the recommendations table of the database.
viewFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String
}

'''
Get request that sends the info of the frontend of the products that are recommended for that user.
'''
class Recommendations(Resource):
    @marshal_with(productFields)
    def get(self, user_id):
        return RecommendationsService.get_recommended_for_user(user_id)

'''
Post request that adds that a product has been viewed by a certain user.
'''    
class TrackViewedProducts(Resource):
    def post(self, product_id):
        data = request.get_json()
        product = ProductsModel.query.get(product_id)
        if not product:
            return {"message": "Invalid product id"}, 400
        if not data or not data.get("user_id"):
            return {"message": "user_id is required"}, 400
        user_id = data.get("user_id")
        RecommendationsService.track_view(user_id, product_id)
        return {'message': 'View tracked'}, 201
#endregion

#region Prices
#Fields that correspond to the prices columns in the database.
priceFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'store': fields.String,
    'price': fields.Float,
    'rating': fields.Float,
    'url': fields.String
}

'''
Get request that gets all the price, rating data for a certain product.
'''
class Prices(Resource):
    @marshal_with(priceFields)
    def get(self, id):
        prices = PricesModel.query.filter_by(product_id=id).all()
        return prices
#endregion
 
#region Comments
#Things that are needed to find products to compare that are not in the comment table in the database.
comment_args = reqparse.RequestParser()
comment_args.add_argument('user_id', type=str, required=True, location="json")
comment_args.add_argument('text', type=str, required=True, location="json")
comment_args.add_argument('field', type=str, required=False, location="json")

#Fields used when a user adds a comment to a product.
commentFields = {
     'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String,
    'text': fields.String,
    'field': fields.String,
    'created_at': fields.DateTime
}

#Fields used when finding products to compare when both products have comments.
compareCommentFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'product_name': fields.String,
    'category': fields.String,
    'text': fields.String,
    'field': fields.String
}

#Argument for getting the right user id for comments
user_query_args = reqparse.RequestParser()
user_query_args.add_argument('user_id', type=str, required=True, location="args")

'''
Get request to get the comments the user has already added for a product.
'''
class CommentsForProduct(Resource):
    def get(self, product_id):
        args = user_query_args.parse_args()
        comments, error = CommentService.get_comments_for_products(product_id, args["user_id"])
        if error:
            return {"message": error}, 400

        return marshal(comments, commentFields), 200

'''
Post request that sends the data thats in the comment to be added to the database.
'''    
class AddComment(Resource):
    #@marshal_with(commentFields)
    def post(self, product_id):
        args = comment_args.parse_args()
        comment, error = CommentService.add_comment(
            product_id,
            args["user_id"],
            args["text"],
            args["field"]
        )
        if error == "Invalid product id":
            return {"message": error}, 400
        if error == "Comment text can not be empty":
            return {"message": error}, 400
        return marshal(comment, commentFields), 201

'''
Get request that finds other products of the same category that also have comments for the user to compare.
'''
class FindSameCategoryWithComments(Resource):
    @marshal_with(compareCommentFields)
    def get(self, product_id):
        args = user_query_args.parse_args()
        user_id = args["user_id"]

        return CommentService.Get_other_products(product_id, user_id)
#endregion

#The endpoints for all api CRUD operations.
api.add_resource(Products, '/api/products')
api.add_resource(Prices, '/api/prices/<int:id>')
api.add_resource(SortProductsByCategory, '/api/products/category/<string:category>')
api.add_resource(ProductByID, '/api/products/ID/<int:id>')
api.add_resource(CommentsForProduct, '/api/comments/<int:product_id>')
api.add_resource(AddComment, '/api/comments/add/<int:product_id>')
api.add_resource(SearchProducts, '/api/products/search')
api.add_resource(Recommendations, '/api/recommendations/<string:user_id>')
api.add_resource(TrackViewedProducts, '/api/track-view/<int:product_id>')
api.add_resource(GetLikedItems, '/api/liked/<string:user_id>/<int:product_id>')
api.add_resource(ToggleLikes, '/api/likes/toggle/<int:product_id>')
api.add_resource(GetLikedItems, '/api/liked/<string:user_id>', endpoint='all_likes')
api.add_resource(FindSameCategoryWithComments, '/api/comments/compare/<int:product_id>')

#Helps set up the debug enviorment
@app.route('/')
def home():
    return '<h1>Test</h1>'
if __name__ == '__main__':
    app.run(debug=False) 

print (pyodbc.drivers())