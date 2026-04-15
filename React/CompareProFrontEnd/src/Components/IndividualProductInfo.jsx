import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Likes from '../Components/Likes'
import "../Pages/ProductPerSite.css"

export function IndividualProductInfo() {
    const { id } = useParams()
    const [ product, setProduct ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    useEffect(() => {
            setLoading(true)
            setError(null)
            fetch(`http://localhost:5000/api/products/ID/${id}`)
                .then(response => response.json())
                .then(data => {
                    setProduct(data)
                    setLoading(false)
                })
                .catch(error => {
                    setError(error.message)
                    setLoading(false)
                })
     }, [id])

     if (loading) {
        return <div>Loading products...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    if (!product) {
        return <div>Product not found</div>
    }

    return (
        <>
            <div className="Top">
                <h1 className="mainHeaders">{product.name}</h1>
            </div>
            <div className='ProductImg'>
                <img src={product.image} style={{ maxWidth: '100%' }}></img>
            </div>
            <div className="ProductInfo">
                <h5>Brand: {product.brand}</h5>
                <h5>Category: {product.category}</h5>
                <h5>Model Number: {product.model_num}</h5>
                <div className='featuresContainer'>
                    <ul className="featuresList">
                        {product.features
                            ?.split("|")
                            .map((features, i) => (
                                <li key={i}>{features.trim()}</li>
                            ))}
                    </ul> 
                </div>
            </div>

            <div>
                <Likes product={product} />
            </div>
        </>
    )
}