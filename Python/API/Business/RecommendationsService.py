from extensions import db
from Models.Models import RecommendationModel, ProductsModel

class RecommendationsService:
    @staticmethod
    def get_recommended_for_user(user_id):
        view_history = RecommendationModel.query.filter_by(user_id=user_id).all()
        ids_viewed = [product.product_id for product in view_history]
        if not ids_viewed:
            return []
        
        products_viewed = ProductsModel.query.filter(ProductsModel.id.in_(ids_viewed)).all()
        category = {cat.category for cat in products_viewed}
        brand = {b.brand for b in products_viewed}

        return ProductsModel.query.filter(
            ProductsModel.category.in_(category),
            ProductsModel.brand.in_(brand),
            ~ProductsModel.id.in_(ids_viewed)
        ).limit(6).all()
    
    @staticmethod
    def track_view(user_id, product_id):
        viewed = RecommendationModel(user_id=user_id, product_id=product_id)
        db.session.add(viewed)
        db.session.commit()