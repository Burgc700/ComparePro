import sys
from pathlib import Path
import pytest

sys.path.append(str(Path(__file__).resolve().parents[1]))

from api import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_basic():
    assert 1 + 1 == 2

#region PostReqAddComment
def test_add_comment_missing_fields(client): #invalid input
    response = client.post("/api/comments/add/1", json={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    })
    assert response.status_code != 201

def test_add_comment_invalid_id(client): #Invalid product id
    response = client.post("/api/comments/add/1000", json={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW",
        "field": "con",
        "text": "test bad id comment"
    })
    assert response.status_code != 201

def test_duplicate_add_comment(client): #duplicate comment
    commentData={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW",
        "field": "pro",
        "text": "Should allow duplicates"
    }
    client.post("/api/comments/add/10", json=commentData)
    client.post("/api/comments/add/10", json=commentData)
    response = client.get("api/comments/10?user_id=user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    sameComment = [c for c in response.json if c["text"] == "Should allow duplicates"]
    assert len(sameComment) >= 2

def test_invalid_comment_input(client): #Makes sure comment with no text is not added
    response = client.post("/api/comments/add/10", json={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW",
        "field": "pro",
        "text": ""
    })
    assert response.status_code != 201
#endregion

#region PostReqToggleLike
def test_toggle_liked_item_missing_field(client): #Missing field
    response = client.post("/api/likes/toggle/1", json={
        "user": None
    })
    assert response.status_code != 201

def test_toggle_liked_item_invalid_id(client): #invalid product id
    response = client.post("/api/likes/toggle/1000", json={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    })
    assert response.status_code != 201

def test_toggle_like_item_multiple_request_liked(client): #testing if after multiple it doesn't turn to a race case and end value is what is expected should be liked
    user_id = "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    product_id = 50
    data = {"user_id": user_id}

    before = client.get(f"/api/liked/{user_id}/{product_id}").json["liked"]

    response = None
    for _ in range(7):
        response = client.post(f"/api/likes/toggle/{product_id}", json=data)

    after = response.json["liked"]

    assert after != before

def test_toggle_like_item_multiple_request_not_liked(client): #testing if after multiple it doesn't turn to a race case and end value is what is expected should be not liked
    toggleLikeData={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    }
    for _ in range(6):
        response = client.post("/api/likes/toggle/52", json=toggleLikeData)
    assert response.status_code == 200
    assert response.json["liked"] == False
#endregion

#region PostReqTrackView
def test_trackview_missing_field(client): #Test invalid user_id
    response = client.post("/api/track-view/10", json={
        "user_id": None
    })
    assert response.status_code == 400

def test_trackview_invalid_id(client): #Test invalid product id
    response = client.post("/api/track-view/1000", json={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    })
    assert response.status_code == 400

def test_trackview_multiple_views(client): #Test if item is viewed multiple times
    trackViewData={
        "user_id": "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    }
    response1 = client.post("/api/track-view/20", json=trackViewData)
    response2 = client.post("/api/track-view/20", json=trackViewData)
    assert response1.status_code == 201
    assert response2.status_code == 201
#endregion

#region GetReqPricesForProducts
def test_get_price_valid_product(client): #Test successful request
    response = client.get("/api/prices/10")
    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0
    assert "store" in response.json[0]
    assert "price" in response.json[0]
    assert "rating" in response.json[0]

def test_get_prices_invalid_product_id(client): #Tests invalid product id
    response = client.get("/api/prices/999999")
    assert response.status_code == 200
    assert response.json == []

def test_get_prices_bad_id_type(client): #Test bad id
    response = client.get("/api/prices/abc")

    assert response.status_code != 200

def test_get_prices_multiple_requests(client): #Test multiple request
    for _ in range(5):
        response = client.get("/api/prices/1")

        assert response.status_code == 200
        assert isinstance(response.json, list)
#endregion

#region GetReqAllProducts
def test_get_all_products(client): #Tests to make sure we get all products
    response = client.get("/api/products")
    assert len(response.json) == 165
#endregion

#region GetReqAllCategoryPage
def test_get_all_products_from_category(client): #tests to make sure we have all the ids for a category
    response1 = client.get("/api/products/category/cpu")
    response2 = client.get("/api/products/category/gpu")
    response3 = client.get("/api/products/category/ssd")
    response4 = client.get("/api/products/category/ram")
    assert len(response1.json) == 37
    assert len(response2.json) == 84
    assert len(response3.json) == 39
    assert len(response4.json) == 5
#endregion

#region GetReqProductPages
def test_success_product_page_info(client): #Test valid request
    response = client.get("/api/products/ID/50")
    assert response.status_code == 200
    assert "name" in response.json
    assert "brand" in response.json
    assert "model_num" in response.json
    assert "category" in response.json
    assert "features" in response.json

def test_product_page_invalid_id(client): #Tests invalid product id
    response = client.get("/api/product/ID/1000")
    assert response.status_code != 200

def test_product_page_invalid_type(client): #Test invalid type for product id
    response = client.get("/api/product/ID/xyz")
    assert response.status_code != 200

def test_product_page_multiple_req(client): #Test multiple request
    for _ in range(5):
        response = client.get("/api/products/ID/20")
        assert response.status_code == 200
        assert isinstance(response.json, dict)
#endregion

#region GetReqGetComments
def test_get_comments_success(client): #Tests success with product with comments
    response = client.get("/api/comments/5?user_id=user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    assert response.status_code == 200
    assert len(response.json) > 0
    assert "text" in response.json[0]
    assert "user_id" in response.json[0]
    assert "field" in response.json[0]

def test_get_comments_no_comments(client): #Test that an empty list is returned when a product has no comment
    response = client.get("/api/comments/20?user_id=user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    assert response.status_code == 200
    assert len(response.json) == 0

def test_get_comments_invalid_id(client): #Test invalid id
    response = client.get("/api/comments/10000?user_id=user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    assert response.status_code != 200

def test_get_comment_invalid_type(client): #Tests invalid type
    response = client.get("/api/comments/xyz?user_id=user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    assert response.status_code != 200

def test_get_comment_invalid_user_id(client): #Tests that an empty list is returned with an invalid user id
    response = client.get("/api/comments/xyz?user_id=test")
    assert response.status_code != 200
    #assert len(response.json) == 0
#endregion

#region GetReqSearch
def test_search_valid_search(client):
    response = client.get("/api/products/search?q=intel")
    assert response.status_code == 200
    assert len(response.json) == 25
    assert "name" in response.json[0]
    assert "brand" in response.json[0]
    assert "model_num" in response.json[0]
    assert "category" in response.json[0]
    assert "features" in response.json[0]

def tests_search_invalid_search(client): #Tests no matched items gives empty list
    response = client.get("/api/products/search?q=xyz")
    assert response.status_code == 200
    assert len(response.json) == 0
#endregion

#region GetReqRecommendations
def test_get_recs_for_user(client): #Test successful request
    response = client.get("/api/recommendations/user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    assert response.status_code == 200
    assert len(response.json) == 6

def test_get_recs_for_invalid_user(client): #Tests recs for invalid user. Should still get length 6, we are always returning top 6 even if there is no view history
    response = client.get("/api/recommendations/test_user")
    assert response.status_code == 200
    assert len(response.json) == 6

def test_get_recs_after_new_view(client): #Test to make sure the recommendations are valid
    user_id = "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"

    client.post("/api/track-view/10", json={
        "user_id": user_id
    })

    response = client.get(f"/api/recommendations/{user_id}")

    assert response.status_code == 200
    assert isinstance(response.json, list)
    assert len(response.json) > 0
#endregion

#region GetReqGetLikes
def test_get_likes_that_liked(client): #Tests if a product is liked
    response = client.get("/api/liked/user_3ADS3TmrTw3sWbzJXDtp19B2iAW/1")
    assert response.status_code == 200
    assert response.json["liked"] is True

def test_get_likes_not_liked(client): #Tests if a product is not liked
    response = client.get("/api/liked/user_3ADS3TmrTw3sWbzJXDtp19B2iAW/100")
    assert response.status_code == 200
    assert response.json["liked"] is False

def test_get_likes_toggle_reflects(client): #Tests if a product is not liked then liked get request return correct
    user_id = "user_3ADS3TmrTw3sWbzJXDtp19B2iAW"
    product_id = 150
    data = {"user_id": user_id}
    res1 = client.get(f"/api/liked/{user_id}/{product_id}")
    before = res1.json["liked"]
    client.post(f"/api/likes/toggle/{product_id}", json=data)
    res2 = client.get(f"/api/liked/{user_id}/{product_id}")
    after = res2.json["liked"]
    assert before != after

def test_get_likes_multiple_request(client): #Test to make sure each time request is sent stays the same when retrieving the liked item
    response1 = client.get("/api/liked/user_3ADS3TmrTw3sWbzJXDtp19B2iAW/100")
    response2 = client.get("/api/liked/user_3ADS3TmrTw3sWbzJXDtp19B2iAW/100")
    response3 = client.get("/api/liked/user_3ADS3TmrTw3sWbzJXDtp19B2iAW/100")
    assert response1.status_code and response2.status_code and response3.status_code == 200
    assert response1.json["liked"] is False
    assert response2.json["liked"] is False
    assert response3.json["liked"] is False

def test_get_likes_invalid_product_id(client): #Tests that liked is false when invalid product id, no id fits that product should always be false tell theres 1000 products
    response = client.get("/api/liked/user_3ADS3TmrTw3sWbzJXDtp19B2iAW/1000")
    assert response.status_code == 200
    assert response.json["liked"] is False

def test_get_likes_invalid_user_id(client): #Tests that liked is false when invalid user id, should always be false endless a user has that id
    response = client.get("/api/liked/test/10")
    assert response.status_code == 200
    assert response.json["liked"] is False
#endregion

#region GetReqCompareProducts
def test_get_recs_success(client):
    response = client.get("/api/comments/compare/5?user_id=user_3ADS3TmrTw3sWbzJXDtp19B2iAW")
    assert response.status_code == 200
    assert len(response.json) > 0

def test_get_recs_no_comments_for_category(client): #Tests that if mulitple products in the category done have a comment then none is populated
    response = client.get("/api/comments/compare/5?user_id=user_3D5cI9aF9Bmhhu8LnIwwicXbaSM")
    assert response.status_code == 200
    assert len(response.json) == 0

def test_get_recs_invalid_userid(client):
    response = client.get("/api/comments/compare/5?user_id=test")
    assert response.status_code == 200
    assert len(response.json) == 0

def test_get_recs_invalid_product_id(client): #Tests invalid product id
    response = client.get("/api/comments/compare/abc?user_id=user_3D5cI9aF9Bmhhu8LnIwwicXbaSM")
    assert response.status_code != 200

def test_get_recs_product_id_not_found(client): #Tests product id that does not exist
    response = client.get("/api/comments/compare/1000?user_id=user_3D5cI9aF9Bmhhu8LnIwwicXbaSM")
    assert response.status_code == 200
#endregion

#region GetReqFilterProducts
def test_filer_success(client): #Tests a successful filter
    response = client.get("/api/products/category/cpu?minPrice=200&minRating=4")
    assert response.status_code == 200
    assert len(response.json) > 0

def test_filter_bad_params(client): #Tests bad params for price should give back all cpus still
    response = client.get("/api/products/category/cpu?minPrice=abc&minRating=xyz")
    assert response.status_code == 200
    assert len(response.json) > 0

def test_filter_one_bad_param(client): #Tests a bad price param, should give back all cpus that have rating higher than 3
    response = client.get("/api/products/category/cpu?minPrice=abc&minRating=3")
    assert response.status_code == 200
    assert len(response.json) > 0

def test_filter_parms_not_in_range(client): #Tests params not in range should give back empty list. This shouldn't ever happen becuase theres a range on the front end
    response = client.get("/api/products/category/cpu?minPrice=100000&minRating=10")
    assert response.status_code == 200
    assert len(response.json) == 0
#endregion