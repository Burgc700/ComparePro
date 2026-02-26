
import urllib
import pyodbc
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Numeric
from flask_restful import Api, Resource, reqparse, fields, marshal_with, abort
from flask_cors import CORS


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
    id = db.Column('Product_id', db.Integer, primary_key = True)
    name = db.Column('Product_name', db.String(400), nullable = True)
    brand = db.Column('Brand', db.String(50), nullable = True)
    model_num = db.Column('Model_number', db.String(50), nullable = True)
    category = db.Column('Product_Category', db.String(50), nullable = True)
    image = db.Column('Image_URL', db.String(1000))
    features = db.Column('Features', db.String(1073741823))

    def __repr__(self):
        return f"Product name: {self.name}, Brand: {self.brand}, Model_num: {self.model_num} Category: {self.category}, Image URL: {self.image}, features: {self.features})"

product_args = reqparse.RequestParser()
product_args.add_argument('name', type=str, required=True)
product_args.add_argument('brand', type=str, required=True)
product_args.add_argument('category', type=str, required=True)
product_args.add_argument('Model Number', type=str, required=True)
product_args.add_argument('Features', type=str, required=True)

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

#region Prices
class PricesModel(db.Model):
    __tablename__ = 'Price'
    id = db.Column('Price_id', db.Integer, primary_key = True)
    product_id = db.Column('Product_id', db.Integer, db.ForeignKey('Products.Product_id'), nullable=True)
    store = db.Column('Store', db.String(20), nullable = True)
    price = db.Column('Price', Numeric(6, 2), nullable = True)
    rating = db.Column('Rating', Numeric(2, 1), nullable = True)
    url = db.Column('URL', db.String(1000))

    def __repr__(self):
        return f"Product id: {self.product_id}, store: {self.store}, price: {self.price} Rating: {self.rating}, URL: {self.url})"

price_args = reqparse.RequestParser()
price_args.add_argument('product_id', type=int, required=True)
price_args.add_argument('store', type=str, required=True)
price_args.add_argument('price', type=float, required=True)

priceFields = {
    'id': fields.Integer,
    'product_id': fields.Integer,
    'store': fields.String,
    'price': fields.Float,
    'rating': fields.Float,
    'url': fields.String,
}

class Prices(Resource):
    @marshal_with(priceFields)
    def get(self, id):
        prices = PricesModel.query.filter_by(product_id=id).all()
        return prices
#endregion

api.add_resource(Products, '/api/products')
api.add_resource(Prices, '/api/prices/<int:id>')
api.add_resource(SortProductsByCategory, '/api/products/category/<string:category>')
api.add_resource(ProductByID, '/api/products/ID/<int:id>')

@app.route('/')
def home():
    return '<h1>Test</h1>'
if __name__ == '__main__':
    app.run(debug=True) 

print (pyodbc.drivers())