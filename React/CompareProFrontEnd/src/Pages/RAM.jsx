import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Likes from '../Components/Likes'
import "./Home.css"

export function RAM() {
    const [Products, setProducts] = useState([])
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(null)

    useEffect(() => {
        fetch('http://localhost:5000/api/products/category/ram')
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch( error => {
                setError(error.message)
                setLoading(false)
            })
    }, [])

    if(loading) {
        return <div>Loading all products...</div>
    }

    if(error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <h1 className="mainHeaders">RAM'S</h1>
                <div className="AllProducts">
                    {Products.map((product, index) => ( 
                        <div key={index} className="productCard">
                            <Link to={`/product/${product.id}`} key={index} className="productLink">
                                <img className='productimg' src={product.image} style={{maxWidth: '100%'}} />
                                <p>{product.name}</p>
                                <p>Brand: {product.brand}</p>
                                <p>Model Number: {product.model_num}</p>
                                <p>Category: {product.category}</p>
                                {/* <ul className="featuresList">
                                    {product.features
                                        ?.split("|")
                                        .map((features, i) => (
                                            <li key={i}>{features.trim()}</li>
                                        ))
                                    }
                                </ul> */}
                            </Link>
                            <Likes product={product} />
                        </div>
                    ))}
                </div>
        </>
    )
}