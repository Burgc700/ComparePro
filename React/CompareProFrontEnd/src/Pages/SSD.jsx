import { useState, useEffect } from "react"
import "./Home.css"

export function SSD() {
    const [Products, setProducts] = useState([])
        const [loading, setLoading] = useState(true)
        const [error, setError] = useState(null)

    useEffect(() => {
        fetch('http://localhost:5000/api/products/ssd')
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
            <h1 className="mainHeaders">SSD'S</h1>
                <div className="AllProducts">
                    {Products.map((product, index) => ( 
                        <div key={index} className="productCard">
                            <img src={product.image} style={{maxWidth: '100%'}} />
                            <p>{product.name}</p>
                            <p>{product.brand}</p>
                            <p>{product.model_num}</p>
                            <p>{product.category}</p>
                            <ul className="featuresList">
                                <li>{product.features}</li>
                            </ul>
                        </div>
                    ))}
                </div>
        </>
    )
}