import { useState, useEffect, use } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import "../Pages/ProductPerSite.css"


export function PriceComparison() {
    const { id } = useParams()
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ prices, setPrices ] = useState([])

    useEffect(() => {
        setLoading(true)
        setError(null)
        fetch(`http://localhost:5000/api/prices/${id}`)
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

    if(loading) {
        return <div>Loading price comparison</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    return (
        <>
            <h2 className="subheader">Comparison between sites</h2>
            <div className="priceComparison">

                {prices.map((prices, index) => (
                    <div key={index} className="priceComp">
                        <h3><strong>{prices.store}</strong></h3>
                        <p>{prices.price}</p>
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