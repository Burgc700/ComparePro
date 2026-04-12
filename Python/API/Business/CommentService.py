# from extensions import db
# from Models.Models import CommentsModel, ProductsModel

# class CommentService:
#     @staticmethod
#     def Get_other_products(product_id):
#         product = ProductsModel.query.get(product_id)
#         if not product:
#             return []
#         category = product.category
#         results = (
#             db.session.query(CommentsModel, ProductsModel)
#             .join(ProductsModel, CommentsModel.product_id == ProductsModel.id)
#             .filter(
#                 ProductsModel.category == category,
#                 CommentsModel.product_id != product_id
#             )
#             .all()
#         )
#         returned_products = []
#         for comment, product in results:
#             returned_products.append({
#                 "id": comment.id,
#                 "product_id": comment.product_id,
#                 "product_name": product.name,
#                 "category": product.category,
#                 "field": comment.field,
#                 "text": comment.text
#             })
#         return returned_products
    
from extensions import db
from Models.Models import CommentsModel, ProductsModel
from sqlalchemy import func

class CommentService:
    @staticmethod
    def Get_other_products(product_id):
        product = ProductsModel.query.get(product_id)

        if not product:
            print("No product found for id:", product_id)
            return []

        category = product.category
        print("Current product:", product.id, product.name, "category:", repr(category))

        all_comments = CommentsModel.query.all()
        print("All comments in database:")
        for c in all_comments:
            print(
                "comment_id:", c.id,
                "| product_id:", c.product_id,
                "| field:", repr(c.field),
                "| text:", repr(c.text)
            )

        all_products = ProductsModel.query.all()
        print("All products in database:")
        for p in all_products:
            print(
                "product_id:", p.id,
                "| name:", repr(p.name),
                "| category:", repr(p.category)
            )

        results = (
            db.session.query(CommentsModel, ProductsModel)
            .join(ProductsModel, CommentsModel.product_id == ProductsModel.id)
            .filter(
                func.lower(func.trim(ProductsModel.category)) == func.lower(func.trim(category)),
                CommentsModel.product_id != product_id
            )
            .all()
        )

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