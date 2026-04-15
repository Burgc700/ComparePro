import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Likes from '../Components/Likes'
import "./Home.css"

export function SearchResults() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [products, setProducts] = useState([])
    const [searchParams] = useSearchParams()
    const query = searchParams.get('q')

    useEffect(() => {
        if(!query) {
            setLoading(false)
            return
        }
        fetch(`http://localhost:5000/api/products/search?q=${query}`)
            .then(response => response.json())
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })
    }, [query])

    if(loading) {
        return <div>Loading products that fit search criteria</div>
    }
    if(error) {
        return <div>Error: {error}</div>
    }
    if(products.length === 0) {
        return <div>No product information matches {query}</div>
    }

    return (
        <>
            <h1 className="mainHeaders">Results for {query}</h1>
                <div className="AllProducts">
                    {products.map((product, index) => ( 
                        <div key={index} className="productCard">
                            <Link to={`/product/${product.id}`} key={index} className="productLink">
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