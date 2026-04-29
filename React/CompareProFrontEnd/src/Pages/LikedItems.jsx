//Imports for components and styling used for the page.
import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import Likes from '../Components/Likes'
import "./Home.css"

//Function that defines the liked items page.
const LikedItems = () => {
    //Gets the user id for the user signed in so the liked items that show up in the page that the user has liked.
    const { user, isSignedIn } = useUser()
    //Hooks that set the items in the page.
    const [ likedProducts, setLikedProducts ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const fetchLikes = async () => {
            if(!isSignedIn || !user) {
                setLoading(false)
                return
            }
            //Gets the items liked by the user and the product cards for the products.
            try {
                const likeResponse = await fetch(`http://localhost:5000/api/liked/${user.id}`)
                const likedIds = await likeResponse.json()
                const productResponse = await fetch(`http://localhost:5000/api/products`)
                const allProducts = await productResponse.json()
                const filter = allProducts.filter(p => likedIds.map(Number).includes(Number(p.id)))
                setLikedProducts(filter)
            }
            catch(error) {
                console.error('Could not get liked items', error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchLikes();
    }, [isSignedIn, user])

    //Makes sure the user is logged in.
    if(!isSignedIn) {
        return("Must sign in to view liked items")
    }

    //Returns when the items are loading.
    if(loading) {
        <h1>Loading Liked items</h1>
    }

    //The items in the order that the are being displayed on the page.
    return(
        <>
            <h1 className='mainHeaders'>Liked Items</h1>
            <div className="AllProducts">
                {likedProducts.map((product) => ( 
                    <div key={product.id} className="productCard">
                        <Link to={`/product/${product.id}`} key={product.id} className="productLink">
                            <img src={product.image} style={{maxWidth: '100%'}} />
                            <p>{product.name}</p>
                            <p>{product.brand}</p>
                            <p>{product.model_num}</p>
                            <p>{product.category}</p>
                        </Link>
                        <Likes product={product} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default LikedItems