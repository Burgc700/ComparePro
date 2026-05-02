import sys
from pathlib import Path
import pytest
import uuid

sys.path.append(str(Path(__file__).resolve().parents[1]))

from api import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

#Tests adding a comment and fetching the comment
def test_add_comment_and_fetch(client):
    user_id = "test_user"
    product_id = 50
    text = "Comment for test case"
    post_response = client.post(f"/api/comments/add/{product_id}", json={
        "user_id": user_id,
        "field": "pro",
        "text": text
    })
    assert post_response.status_code == 201

    fetch_response = client.get(f"/api/comments/{product_id}?user_id={user_id}")
    assert fetch_response.status_code == 200
    assert any(comment["text"] == text for comment in fetch_response.json)

def test_toggle_to_like_shows_up_as_liked(client):
    user_id = f"test_user_{uuid.uuid4()}"
    product_ids = [20, 40, 100]

    for pid in product_ids:
        post_response = client.post(f"/api/likes/toggle/{pid}", json={
            "user_id": user_id
        })

        assert post_response.status_code == 201
        assert post_response.json["liked"] is True

        after = client.get(f"/api/liked/{user_id}/{pid}")

        assert after.status_code == 200
        assert after.json["liked"] is True

def test_track_view_does_not_show_in_recs(client):
    user_id = f"test_user_{uuid.uuid4()}"
    product_ids = [100, 125, 75]
    for track in product_ids:
        post_response = client.post(f"/api/track-view/{track}", json={"user_id": user_id})
        assert post_response.status_code == 201
        assert post_response.json["message"] == "View tracked"

        get_response = client.get(f"/api/recommendations/{user_id}")
        assert get_response.status_code == 200
        recommended = (recs["id"] != product_ids for recs in get_response.json)
        for returned_recs in product_ids:
            assert returned_recs not in recommended