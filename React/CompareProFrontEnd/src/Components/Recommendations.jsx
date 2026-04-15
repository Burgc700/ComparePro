import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import Likes from '../Components/Likes'
import "../Pages/Home.css"

export function Recommendations() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const[recommendations, setRecommendations] = useState([])
    const {user, isSignedIn} = useUser()

    useEffect(() => {
        if(isSignedIn && user) {
            fetch(`http://localhost:5000/api/recommendations/${user.id}`)
                .then(response => {
                    if(!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`)
                    }
                    return response.json()
                })
                .then(data => {
                    setRecommendations(data)
                    setLoading(false)
                })
                .catch(error => {
                    console.error("Recommendations error:", error)
                    setError(error.message)
                    setLoading(false)
                })
        }
        else {
            setLoading(false)
        }
    }, [isSignedIn, user])

    if(loading) {
        return <div>Loading all products</div>
    }

    if(error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <h2 className="mainHeaders">Recommended for you</h2>
            <div className="AllProducts">
                {recommendations.map((product) => (
                    <div key={product.id} className="productCard">
                        <Link to={`/product/${product.id}`} key={product.id} className="productLink">
                            <img className='productimg' src={product.image} alt={product.name} style={{maxWidth: '100%'}}/>
                            <p>{product.name}</p>
                            <p>Brand: {product.brand}</p>
                            <p>Category: {product.category}</p>
                        </Link>
                        <Likes product={product} />
                    </div>
                    
                ))}
            </div>
        </>
    )
}