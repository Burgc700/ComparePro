//Imports needed to display the items.
import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Likes from '../Components/Likes'
import { FilterPriceAndRating } from "./VerticalNavBar"
import "../Pages/Home.css"

//Function to get all products from each category. Also helps in the sorting for price and rating.
export function CategoryProducts() {
    //Parameter to get the right category for the list of products for each category.
    const { category } = useParams()
    //Hooks to set items to the right values on the display.
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [priceValue, setPriceValue] = useState(0)
    const [ratingValue, setRatingValue] = useState(0)
    const [appliedPriceFilter, setAppliedPriceFilter] = useState(0)
    const [appliedRatingFilter, setAppliedRatingFilter] = useState(0)
    const page = category?.toUpperCase()
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        //Resets the price and rating sorting parameters each time a new page is selected.
        const defaultValues = {
            CPU: { price: 0, rating: 3},
            GPU: { price: 0, rating: 3},
            SSD: { price: 0, rating: 3},
            RAM: { price: 0, rating: 3}
        }
        //Gets the default value of the page we are on.
        const pageDefaults = defaultValues[page] || { price: 50, rating: 3}
        //Sets the default value depending on what page we are on.
        setPriceValue(pageDefaults.price)
        setRatingValue(pageDefaults.rating)
        setAppliedPriceFilter(pageDefaults.price)
        setAppliedRatingFilter(pageDefaults.rating)
    }, [page])

    useEffect(() => {
        setLoading(true)
        setError(null)
        //Fetches the products that fit the filter criteria.
        fetch(`${API_URL}/api/products/category/${category}?minPrice=${appliedPriceFilter}&minRating=${appliedRatingFilter}`)
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`)
                }
                return response.json()
            })
            //Sets the products cards for those products that fit the criteria.
            .then(data => {
                setProducts(data)
                setLoading(false)
            })
            .catch( error => {
                setError(error.message)
                setLoading(false)
            })
    }, [category, appliedPriceFilter, appliedRatingFilter])

    //Helper function to apply the price and rating filters to the current page.
    function ApplyFilters() {
        setAppliedPriceFilter(priceValue)
        setAppliedRatingFilter(ratingValue)
    }

    //Returns this when the products are loading.
    if(loading) {
        return <div>Loading all {category}'s</div>
    }

    //Returns if an error occurs with the error.
    if(error) {
        return <div>Error: {error}</div>
    }

    //How the components are displayed on the screen and the order.
    return (
        <div className="Layout">
            <FilterPriceAndRating page={page} priceValue={priceValue} setPriceValue={setPriceValue}
                ratingValue={ratingValue} setRatingValue={setRatingValue} ApplyFilters={ApplyFilters}
            />

            <div className="Content">
                <div className="InnerContent">
                    <h1 className="mainHeaders">{category}'s</h1>

                    <div className="AllProducts">
                        {Products.map((product, index) => (
                            <div key={index} className="productCard">
                                <Link to={`/product/${product.id}`} className="productLink">
                                    <img
                                        className="productimg"
                                        src={product.image}
                                        alt={product.name}
                                    />
                                    <p>{product.name}</p>
                                    <p>Brand: {product.brand}</p>
                                    <p>Model Number: {product.model_num}</p>
                                    <p>Category: {product.category}</p>
                                </Link>
                                <Likes product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}