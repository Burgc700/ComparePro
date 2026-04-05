import urllib
import pyodbc
from flask import Flask
from extensions import db
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_cors import CORS
from flask_restful import marshal
from Models.Models import ProductsModel, PricesModel, CommentsModel, RecommendationModel, LikesModel
from Business.LikeService import LikesService
from Business.RecommendationsService import RecommendationsService


app = Flask(__name__)

CORS(app)

#region Connection
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
productFields = {
    'id': fields.Integer,
    'name': fields.String,
    'brand': fields.String,
    'model_num': fields.String,
    'category': fields.String,
    'image': fields.String,
    'features': fields.String
}

class Products(Resource):
    @marshal_with(productFields)
    def get(self):
        products = ProductsModel.query.all()
        return products
    
class SortProductsByCategory(Resource):
        @marshal_with(productFields)
        def get(self, category):
            products = ProductsModel.query.filter_by(category=category).all()
            return products
        
class ProductByID(Resource):
    @marshal_with(productFields)
    def get(self,id):
        products = ProductsModel.query.get(id)
        if not products:
            abort(404, message="Product not found")
        return products
#endregion  

#region Search    
search_args = reqparse.RequestParser()
search_args.add_argument('q', type=str, required=True, location="args")
    
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
likeFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String
}

class GetLikedItems(Resource):
    def get(self, user_id, product_id=None):
        if product_id:
            like = LikesModel.query.filter_by(user_id=user_id, product_id=product_id).first()
            return {"Liked": like is not None}, 200
        else:
            likes = LikesModel.query.filter_by(user_id=user_id).all()
            likedItems = [like.product_id for like in likes]
            return likedItems, 200
    
class ToggleLikes(Resource):
    def post(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=str, required=True, location='json')
        args = parser.parse_args()
        liked = LikesService.toggle_likes(args['user_id'], product_id)
        if liked:
            return {'liked': True}, 201
        return {'liked': False}, 200
#endregion

#region Recommendations
viewFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String
}

class Recommendations(Resource):
    @marshal_with(productFields)
    def get(self, user_id):
        return RecommendationsService.get_recommended_for_user(user_id)
    
class TrackViewedProducts(Resource):
    def post(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=str, required=True, location='json')
        args = parser.parse_args()
        RecommendationsService.track_view(
            args['user_id'],
            product_id
        )
        return {'message': 'View tracked'}, 201

#endregion

#region Prices
priceFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'store': fields.String,
    'price': fields.Float,
    'rating': fields.Float,
    'url': fields.String
}

class Prices(Resource):
    @marshal_with(priceFields)
    def get(self, id):
        prices = PricesModel.query.filter_by(product_id=id).all()
        return prices
#endregion
 
#region Comments
comment_args = reqparse.RequestParser()
comment_args.add_argument('user_id', type=str, required=True, location="json")
comment_args.add_argument('text', type=str, required=True, location="json")

commentFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String,
    'text': fields.String,
    'created_at': fields.DateTime
}

class CommentsForProduct(Resource):
    def get(self, product_id):
        comments = CommentsModel.query.filter_by(product_id=product_id).order_by(CommentsModel.created_at.desc()).all()
        return marshal(comments, commentFields), 200
    
class AddComment(Resource):
    @marshal_with(commentFields)
    def post(self, product_id):
        args = comment_args.parse_args()
        comment = CommentsModel(product_id=product_id, user_id=args['user_id'], text=args['text'])
        db.session.add(comment)
        db.session.commit()
        db.session.refresh(comment)
        return comment, 201
#endregion

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

@app.route('/')
def home():
    return '<h1>Test</h1>'
if __name__ == '__main__':
    app.run(debug=True) 

print (pyodbc.drivers())