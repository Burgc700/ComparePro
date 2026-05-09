//Imports to help render the component.
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import "../Pages/ProductPerSite.css"

//Function that populates the the boxes and the prices for each site for the product.
export function PriceComparison({productName}) {
    //Parameter that makes sure we are getting the correct product id for the prices we want.
    const { id } = useParams()
    //Hooks that help set the data that is displayed on the page.
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ prices, setPrices ] = useState([])
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        setLoading(true)
        setError(null)
        //Gets the prices for each product for each site.
        fetch(`${API_URL}/api/prices/${id}`)
            .then(response => response.json())
            .then(data => {
                setPrices(data)
                setLoading(false)
            })
            .catch(error => { 
                console.error("Price fetch error:", error)
                setError(error.message)
                setLoading(false)
            })
    }, [id])

    //Returns when the price comparison component is loading.
    if(loading) {
        return <div>Loading price comparison</div>
    }

    //Returns if there is an error loading the prices for each website.
    if (error) {
        return <div>Error: {error}</div>
    }

    //How the components are displayed on the screen and the order.
    return (
        <>
            <h2 className="subheader">Comparison between sites</h2>
            <h3 className="priceName">Prices for: <br/> {productName}</h3>
            <div className="priceComparison">
                {prices.map((prices, index) => (
                    <div key={index} className="priceComp">
                        <h3><strong>{(prices.store)
                            .replace(/\b\w/g, char => char.toUpperCase())    
                        }</strong></h3>
                        <p>${prices.price}</p>
                        <p>{prices.rating}</p>
                        <a href={prices.url} target="_blank" rel="noopener noreferrer">
                            <button className="websiteBtn">View product from {prices.store}</button>
                        </a>
                    </div>
                ))}
            </div>
        </>
    )
}