import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Likes from '../Components/Likes'
import { FilterPriceAndRating } from "./VerticalNavBar"
import "../Pages/Home.css"

export function CategoryProducts() {
    const { category } = useParams()
    const [Products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [priceValue, setPriceValue] = useState(0)
    const [ratingValue, setRatingValue] = useState(0)
    const [appliedPriceFilter, setAppliedPriceFilter] = useState(0)
    const [appliedRatingFilter, setAppliedRatingFilter] = useState(0)
    const page = category?.toUpperCase()

    useEffect(() => {
        const defaultValues = {
            CPU: { price: 0, rating: 3},
            GPU: { price: 0, rating: 3},
            SSD: { price: 0, rating: 3},
            RAM: { price: 0, rating: 3}
        }
        const pageDefaults = defaultValues[page] || { price: 50, rating: 3}
        setPriceValue(pageDefaults.price)
        setRatingValue(pageDefaults.rating)
        setAppliedPriceFilter(pageDefaults.price)
        setAppliedRatingFilter(pageDefaults.rating)
    }, [page])

    useEffect(() => {
        setLoading(true)
        setError(null)
        fetch(`http://localhost:5000/api/products/category/${category}?minPrice=${appliedPriceFilter}&minRating=${appliedRatingFilter}`)
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
    }, [category, appliedPriceFilter, appliedRatingFilter])

    function ApplyFilters() {
        setAppliedPriceFilter(priceValue)
        setAppliedRatingFilter(ratingValue)
    }

    if(loading) {
        return <div>Loading all products...</div>
    }

    if(error) {
        return <div>Error: {error}</div>
    }

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

    // return (
    //     <>
    //         <div className="Layout">
    //             <FilterPriceAndRating page={page}/>
    //             {/* <div>
    //                 Category: {category}
    //             </div> */}
    //             <h1 className="mainHeaders">{category}'s</h1>
    //             <div className="AllProducts">
    //                 {Products.map((product, index) => ( 
    //                     <div key={index} className="productCard">
    //                         <Link to={`/product/${product.id}`} key={index} className="productLink">
    //                             <img className='prodcutimg' src={product.image} style={{maxWidth: '100%'}} />
    //                             <p>{product.name}</p>
    //                             <p>Brand: {product.brand}</p>
    //                             <p>Model Number: {product.model_num}</p>
    //                             <p>Category: {product.category}</p>
    //                         </Link>
    //                         <Likes product={product} />
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </>
    // )
}