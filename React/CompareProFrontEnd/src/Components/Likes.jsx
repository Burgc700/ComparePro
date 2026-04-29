//Imports used to help render the component to the display.
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

//Function that toggles likes and displays the items liked that that user has liked.
//product, intialLiked, onToggle are all props that make sure the product is right, and figures out if the product is liked or not.
const Likes = ({ product, initialLiked, onToggle}) => {
    //Gets the id of the user that is logged in so all the correct likes show up and also makes sure they are logged in to like items.
    const { user, isSignedIn } = useUser()
    //Hooks used to help set the actions that are needed for the page.
    const [ isLiked, setIsLiked ] = useState(false)
    const [ loading, setLoading] = useState(true)

      useEffect(() => {
        if(isSignedIn && user?.id && product?.id) {
            //Gets the items that have been liked by the user so they show up as a liked item on the display.
            fetch(`http://localhost:5000/api/liked/${user.id}/${product.id}`)
                .then(response => response.json())
                //Sets the heart button to a red heart if the user has liked that item.
                .then(data => {
                    setIsLiked(data.Liked) 
                    setLoading(false)
                })
                .catch(error => {
                    console.error('Error fetching likes: ', error)
                    setLoading(false)
                })
        }
        else {
            setLoading(false)
        }
    }, [isSignedIn, user?.id, product?.id])

    //If the button is clicked it changes the appearance of the like button on the display.
    const handleLikeClick = (e) => {
        if(e && e.preventDefault){
            e.preventDefault()
            e.stopPropagation()
        }
        //Makes sure the user is signed in.
        if(!isSignedIn) {
            alert('Sign in to like products')
            return
        }
        //Post request that send back and forth if the user has liked a new item or unliked a item.
        fetch(`http://localhost:5000/api/likes/toggle/${product.id}`, {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({user_id: user.id})
        })
        .then(response => response.json())
        .then(data => {
            setIsLiked(data.liked)
        })
        .catch(error => console.error('Like error:', error))
    }

    //Returns when the like button is loading.
    if(loading) {
        return <div>Loading</div>
    }

    //How the components are displayed on the screen and the order.
    return (
        <>
            <button onClick={handleLikeClick} className='likeBtn'>{isLiked ? '❤️' : '🤍'}</button>
        </>
    )
}

export default Likes