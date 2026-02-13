import { useState, useEffect } from "react"

export function Home() {
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        //const API_URL = 'http://localhost:5000'
        fetch('http://localhost:5000/api/products')
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
            <div className="AllProducts">
                <h1 className="mainHeaders">All Products</h1>
                {Products.map((product, index) => ( 
                    <div key={index}>
                        <form className="productForm">
                            <p>{product.name}</p>
                            <p>{product.brand}</p>
                            <p>{product.model_num}</p>
                            <p>{product.category}</p>
                        </form>
                        <h1>------------------------</h1>
                    </div>
                ))}
            </div>
            
        </>
    )
}