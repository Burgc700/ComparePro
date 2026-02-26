import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "./ProductPerSite.css"

export function ProductPerSite() {
    const { id } = useParams()
    const [ product, setProduct ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ prices, setPrices ] = useState([])

    useEffect(() => {
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

        fetch(`http://localhost:5000/api/prices/${id}`)
            .then(response => response.json())
            .then(data => setPrices(data))
            .catch(error => console.error('Price fetch error: ', error))
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
            <h1 className="mainHeaders">{product.name}</h1>
            <img src={product.image} style={{ maxWidth: '100%' }}></img>
            <div className="ProductInfo">
                <h5>{product.brand}</h5>
                <h5>{product.category}</h5>
            </div>

            <h2>Comparison between sites</h2>
            <div className="priceComparison">

                {prices.map((prices, index) => (
                    <div key={index} className="productCard">
                        <h3><strong>{prices.store}</strong></h3>
                        <p>{prices.price}</p>
                        <p>{prices.rating}</p>
                        <a href={prices.url} target="_blank" rel="noopener noreferrer">
                            <button>View product from {prices.store}</button>
                        </a>
                    </div>
                ))}
            </div>
        </>
    )
}