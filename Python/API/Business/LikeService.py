from extensions import db
from Models.Models import LikesModel

class LikesService:
    @staticmethod
    def toggle_likes(user_id, product_id):
        existingLike = LikesModel.query.filter_by(
            user_id=user_id,
            product_id=product_id
        ).first()
        if existingLike:
            db.session.delete(existingLike)
            db.session.commit()
            return False
        else:
            newLike = LikesModel(user_id=user_id, product_id=product_id)
            db.session.add(newLike)
            db.session.commit()
            return True