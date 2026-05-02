'''
Imports needed for this file.
'''   
from extensions import db
from Models.Models import CommentsModel, ProductsModel
from sqlalchemy import func

'''
Class that helps with the api requests for operations dealing with comments.
'''
class CommentService:
    '''
    Finds other products on the category of the product and if any same category products have comments.
    Product_id: The id to look up in the database to get the category of the current product.
    '''
    @staticmethod
    def Get_other_products(product_id, user_id):
        product = ProductsModel.query.get(product_id) 

        #If there is no product error returns saying there is no product with that id
        if not product:
            print("No product found:", product_id)
            return []
        
        #Checks to make sure the current product also has comments
        current_products_comments = CommentsModel.query.filter_by(product_id=product_id, user_id=user_id).first()
        if not current_products_comments:
            print("Current product has no comments, can't be compared")
            return []

        #The current product that is being viewed.
        category = product.category

        #Pairs all comments with the product and checks to see if that product ids category matches the currently viewed products category.
        results = (
            db.session.query(CommentsModel, ProductsModel)
            .join(ProductsModel, CommentsModel.product_id == ProductsModel.id)
            .filter(
                func.lower(func.trim(ProductsModel.category)) == func.lower(func.trim(category)),
                CommentsModel.product_id != product_id,
                CommentsModel.user_id == user_id
            )
            .all()
        )

        #Filters all the comments to get the right informaiton to display on the screen.
        print("Filtered result count:", len(results))
        for comment, prod in results:
            print(
                "MATCH ->",
                "product_id:", prod.id,
                "| product_name:", repr(prod.name),
                "| category:", repr(prod.category),
                "| field:", repr(comment.field),
                "| text:", repr(comment.text)
            )

        #Returns all the matches found to be displayed.
        returned_products = []
        for comment, prod in results:
            returned_products.append({
                "id": comment.id,
                "product_id": comment.product_id,
                "product_name": prod.name,
                "category": prod.category,
                "field": comment.field,
                "text": comment.text
            })

        return returned_products