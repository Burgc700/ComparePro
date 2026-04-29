'''
Imports needed for this file.
'''   
from extensions import db
from Models.Models import LikesModel

'''
Class that helps with the api requests for operations dealing with likes.
'''
class LikesService:
    '''
    Method used to track if a product has been liked or not.
    '''
    @staticmethod
    def toggle_likes(user_id, product_id):
        #Makes sure it knows which products are liked or not liked.
        existingLike = LikesModel.query.filter_by(
            user_id=user_id,
            product_id=product_id
        ).first()
        #If the comment is already liked and it is unliked turns it false triggering api and front end to change display of button
        if existingLike:
            db.session.delete(existingLike)
            db.session.commit()
            return False
        #If teh comment is not liked and it liked turns it true triggering api and front end to change display of button
        else:
            newLike = LikesModel(user_id=user_id, product_id=product_id)
            db.session.add(newLike)
            db.session.commit()
            return True