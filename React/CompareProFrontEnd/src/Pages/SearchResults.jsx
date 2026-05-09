//Imports for components and styling and others used to render the page.
import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Likes from '../Components/Likes'
import { Navbar } from "../Components/Navbar"
import "./Home.css"

//Function that returns the products based on the search criteria.
export function SearchResults() {
    //Hooks used to set the data for the page.
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [products, setProducts] = useState([])
    const [searchParams] = useSearchParams()
    //Additional parameter that gets the search criteria.
    const query = searchParams.get('q')
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        //Only searches when there is query or something in the search bar.
        if(!query) {
            setLoading(false)
            return
        }
        //Get request that returns the items for the search criteria.
        fetch(`${API_URL}/api/products/search?q=${query}`)
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

    //Returns this when the products are loading from the search criteria.
    if(loading) {
        return <div>Loading products that fit search criteria</div>
    }

    //Returns where there is an error loading the products for the search criteria.
    if(error) {
        return <div>Error: {error}</div>
    }

    //If the search criteria doesn't match any products the following is returned.
    if(products.length === 0) {
        return <div>No product information matches {query}</div>
    }

    //Returns the full page based on the components added to render the page.
    return (
        <>
            <Navbar></Navbar>
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