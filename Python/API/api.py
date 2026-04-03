
import urllib
import pyodbc
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Numeric
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_cors import CORS
from flask_restful import marshal


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
db = SQLAlchemy(app)
#endregion

api = Api(app)

#region Products
class ProductsModel(db.Model):
    __tablename__ = 'Products'
    __table_args__ = {'schema': 'Products'}
    id = db.Column('Product_id', db.Integer, primary_key = True)
    name = db.Column('Product_name', db.String(400), nullable = True)
    brand = db.Column('Brand', db.String(50), nullable = True)
    model_num = db.Column('Model_number', db.String(50), nullable = True)
    category = db.Column('Product_Category', db.String(50), nullable = True)
    image = db.Column('Image_URL', db.String(1000))
    features = db.Column('Features', db.String(1073741823))

    def __repr__(self):
        return f"Product name: {self.name}, Brand: {self.brand}, Model_num: {self.model_num} Category: {self.category}, Image URL: {self.image}, features: {self.features})"

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
class LikesModel(db.Model):
    __tablename__ = "Likes"
    __table_args__ = (db.UniqueConstraint('User_id', 'Product_id', name='UQ_User_Product'),
                      {'schema' : 'Users'})
    id = db.Column('Like_id', db.Integer, primary_key = True)
    product_id = db.Column('Product_id', db.Integer, db.ForeignKey('Products.Products.Product_id'), nullable=False)
    user_id = db.Column('User_id', db.String(100), nullable=False)
    created_at = db.Column('Created_at', db.DateTime, default=db.func.now())

    def __repr__(self):
        return(f"Like_id: {self.id}, by {self.user_id}, Product: {self.product_id} at {self.created_at}")
    
likeFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String
}

class GetLikedItems(Resource):
    #@marshal_with(likeFields)
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
        alreadyLiked = LikesModel.query.filter_by(user_id=args['user_id'], product_id=product_id).first()
        if alreadyLiked:
            db.session.delete(alreadyLiked)
            db.session.commit()
            return {'liked': False}, 200
        else:
            newLike = LikesModel(user_id=args['user_id'], product_id=product_id)
            db.session.add(newLike)
            db.session.commit()
            return {'liked': True}, 201
#endregion

#region Recommendations
class RecommendationModel(db.Model):
    __tablename__ = 'Recommendations'
    __table_args__ = {'schema': 'Users'}
    id = db.Column('View_id', db.Integer, primary_key = True)
    product_id = db.Column('Product_id', db.Integer, db.ForeignKey('Products.Products.Product_id'), nullable=False)
    user_id = db.Column('User_id', db.String(100), nullable = False)
    viewed_at = db.Column('Viewed_at', db.DateTime, default=db.func.now())

    def __repr__(self):
        return(f"View_id: {self.id} Product_id: {self.product_id} User_id: {self.user_id}")
    
    #reqparse stuff if need

viewFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'user_id': fields.String
}

class Recommendations(Resource):
    @marshal_with(productFields)
    def get(self, user_id):
        viewHistory = RecommendationModel.query.filter_by(user_id=user_id).all()
        viewedProducts = [v.product_id for v in viewHistory]
        displayProducts = ProductsModel.query.filter(ProductsModel.id.in_(viewedProducts)).all()
        categories = list(set([p.category for p in displayProducts]))
        brands = list(set([p.brand for p in displayProducts]))
        recommended = ProductsModel.query.filter(
            ProductsModel.category.in_(categories),
            ProductsModel.brand.in_(brands),
            ~ProductsModel.id.in_(viewedProducts)
        ).limit(6).all()
        return recommended
    
class TrackViewedProducts(Resource):
    def post(self, product_id):
        parser = reqparse.RequestParser()
        parser.add_argument('user_id', type=str, required=True, location='json')
        args = parser.parse_args()
        viewedProduct = RecommendationModel(user_id=args['user_id'], product_id=product_id)
        db.session.add(viewedProduct)
        db.session.commit()
        return {'message': 'View tracked'}, 201

#endregion

#region Prices
class PricesModel(db.Model):
    __tablename__ = 'Price'
    __table_args__ = {'schema': 'Products'}
    id = db.Column('Price_id', db.Integer, primary_key = True)
    product_id = db.Column('Product_id', db.Integer, db.ForeignKey('Products.Products.Product_id'), nullable=True)
    store = db.Column('Store', db.String(20), nullable = True)
    price = db.Column('Price', Numeric(6, 2), nullable = True)
    rating = db.Column('Rating', Numeric(2, 1), nullable = True)
    url = db.Column('URL', db.String(1000))

    def __repr__(self):
        return f"Product id: {self.product_id}, store: {self.store}, price: {self.price} Rating: {self.rating}, URL: {self.url})"

# price_args = reqparse.RequestParser()
# price_args.add_argument('product_id', type=int, required=True)
# price_args.add_argument('store', type=str, required=True)
# price_args.add_argument('price', type=float, required=True)

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
class CommentsModel(db.Model):
    __tablename__ = 'User_Comments'
    __table_args__ = {'schema': 'Users'}
    id = db.Column('Comment_id', db.Integer, primary_key = True)
    product_id = db.Column('Product_id', db.Integer, db.ForeignKey('Products.Products.Product_id'), nullable=False)
    user_id = db.Column('User_id', db.String(100), nullable = False)
    text = db.Column('Text', db.String(1073741823), nullable = False)
    created_at = db.Column('Created_at', db.DateTime, default=db.func.now())

    def __repr__(self):
        return (f"Comment id: {self.id} Product id: {self.product_id} User id: {self.user_id} Comment: {self.text}")

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
        #comments = CommentsModel.query.filter_by(product_id=product_id).order_by(CommentsModel.created_at.desc()).all()
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