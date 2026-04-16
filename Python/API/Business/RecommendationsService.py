'''
Imports needed for this file.
'''   
from extensions import db
from Models.Models import RecommendationModel, ProductsModel

'''
Class that helps with the api requests for operations dealing with recommendations.
'''
class RecommendationsService:
    '''
    Method to find recommendations to display to the user.
    '''
    @staticmethod
    def get_recommended_for_user(user_id):
        #Checks the view history to see what products have been viewed.
        view_history = RecommendationModel.query.filter_by(user_id=user_id).all()
        ids_viewed = [product.product_id for product in view_history]
        #If not products have been viewed a empty array is returned.
        if not ids_viewed:
            return []
        
        #For products that have been viewed it gets those and determines how many of each brand and category have been viewed.
        products_viewed = ProductsModel.query.filter(ProductsModel.id.in_(ids_viewed)).all()
        category = {cat.category for cat in products_viewed}
        brand = {b.brand for b in products_viewed}

        #Returns the top 6 recommendations based off what the view history looks like.
        return ProductsModel.query.filter(
            ProductsModel.category.in_(category),
            ProductsModel.brand.in_(brand),
            ~ProductsModel.id.in_(ids_viewed)
        ).limit(6).all()
    
    '''
    Method to track a product that has been viewed by clicking on that product card.
    '''
    @staticmethod
    def track_view(user_id, product_id):
        #Sets the product as viewed based on userid and the productid
        viewed = RecommendationModel(user_id=user_id, product_id=product_id)
        #Adds the product to the database as that user has viewed that product.
        db.session.add(viewed)
        db.session.commit()