import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import "./Home.css"

export function Home() {
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const[recommendations, setRecommendations] = useState([])
    const {user, isSignedIn} = useUser()

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                const shuffledProducts = data.sort(() => Math.random() - 0.5)
                setProducts(shuffledProducts)
                setLoading(false)
            })
            .catch( error => {
                setError(error.message)
                setLoading(false)
            })
    }, [])

    useEffect(() => {
        if(isSignedIn) {
            fetch(`http://localhost:5000/api/recommendations/${user.id}`)
                .then(response => response.json())
                .then(data => setRecommendations(data))
                .catch(error => console.error('Recommendations error:', error))
        }
    }, [isSignedIn, user])

    if(loading) {
        return <div>Loading all products...</div>
    }

    if(error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <h2 className="mainHeaders">Recommended for you</h2>
            <div className="AllProducts">
                {recommendations.map((product) => (
                    <Link to={`/product/${product.id}`} key={product.id} className="productLink">
                        <div className="productCard">
                            <img src={product.image} alt={product.name} style={{maxWidth: '100%'}}/>
                            <p>{product.name}</p>
                            <p>{product.brand}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <h1 className="mainHeaders">All Products</h1>
                <div className="AllProducts">
                    {Products.map((product, index) => ( 
                        <div key={index} className="productCard">
                            <Link to={`/product/${product.id}`} key={index} className="productLink">
                                <img src={product.image} style={{maxWidth: '100%'}} />
                                <p>{product.name}</p>
                                <p>{product.brand}</p>
                                <p>{product.model_num}</p>
                                <p>{product.category}</p>
                                <ul className="featuresList">
                                    <li>{product.features}</li>
                                </ul>
                            </Link>
                        </div>
                    ))}
                </div>
        </>
    )
}