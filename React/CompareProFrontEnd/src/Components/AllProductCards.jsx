//Imports needed to display the items.
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Likes from '../Components/Likes'
import "../Pages/Home.css"

//Function that returns each product in a card format for viewing.
export function AllProducts() {
    //Hooks to set the items.
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        //Fetches all the product information from the database.
        fetch('http://localhost:5000/api/products')
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
                return response.json()
            })
            //Sets the products to display in a random order.
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

    //If the cards are loading this is on the display.
    if(loading) {
        return <div>Loading all products</div>
    }

    //If an error occurs the error is printed for the user.
    if(error) {
        return <div>Error: {error}</div>
    }

    //HTMl to format and add the products cards to the page.
    return (
        <>
            <h1 className="mainHeaders">All Products</h1>
                <div className="AllProducts">
                    {Products.map((product, index) => ( 
                        <div key={index} className="productCard">
                            <Link to={`/product/${product.id}`} key={index} className="productLink">
                                <img className='productimg' src={product.image} style={{maxWidth: '100%'}} />
                                <p>{product.name}</p>
                                <p>Brand: {product.brand}</p>
                                <p>Model Number: {product.model_num}</p>
                                <p>Category: {product.category}</p>
                            </Link>
                            <Likes product={product} />
                        </div>
                    ))}
                </div>
        </>
    )
}