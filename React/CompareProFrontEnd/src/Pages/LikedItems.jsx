import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import Likes from '../Components/Likes'
import "./Home.css"

const LikedItems = () => {
    const { user, isSignedIn } = useUser()
    const [ likedProducts, setLikedProducts ] = useState([])
    const [ loading, setLoading ] = useState(true)

    useEffect(() => {
        const fetchLikes = async () => {
            if(!isSignedIn || !user) {
                setLoading(false)
                return
            }
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

    if(!isSignedIn) {
        return("Must sign in to view liked items")
    }
    if(loading) {
        <h1>Loading Liked items</h1>
    }

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
                            <ul className="featuresList">
                                <li>{product.features}</li>
                            </ul>
                        </Link>
                        <Likes product={product} />
                    </div>
                ))}
            </div>
        </>
    )
}

export default LikedItems