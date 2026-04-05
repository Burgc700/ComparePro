from extensions import db
from sqlalchemy import Numeric

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