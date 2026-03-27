import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

const Likes = ({ product, initialLiked, onToggle}) => {
    const { user, isSignedIn } = useUser()
    const [ isLiked, setIsLiked ] = useState(false)
    const [ loading, setLoading] = useState(true)

      useEffect(() => {
        if(isSignedIn && user?.id && product?.id) {
            fetch(`http://localhost:5000/api/liked/${user.id}/${product.id}`)
                .then(response => response.json())
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

    const handleLikeClick = (e) => {
        if(e && e.preventDefault){
            e.preventDefault()
            e.stopPropagation()
        }
        if(!isSignedIn) {
            alert('Sign in to like products')
            return
        }
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

    if(loading) {
        return <div>Loading</div>
    }

    return (
        <>
            <button onClick={handleLikeClick} className='likeBtn'>{isLiked ? '❤️' : '🤍'}</button>
        </>
    )
}

export default Likes