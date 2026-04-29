import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Likes from '../Components/Likes'
import "../Pages/CompareProducts.css"

export function CompareProductsImageCard() {
    const { originalID, comparedID } = useParams()
    const [ originalProduct, setOriginalProduct ] = useState(null)
    const [ compareProduct, setCompareProduct ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

        useEffect(() => {
            setLoading(true)
            setError(null)
            Promise.all([
                fetch(`http://localhost:5000/api/products/ID/${originalID}`).then(res => res.json()),
                fetch(`http://localhost:5000/api/products/ID/${comparedID}`).then(res => res.json())
            ])
            .then(([originalProductData, compareProductData]) => {
                setOriginalProduct(originalProductData)
                setCompareProduct(compareProductData)
                setLoading(false)
            })
            .catch(error => {
            console.error("Error with Compare page:", error)
            setError("Could not load comparison")
            setLoading(false)
        })
    }, [originalID, comparedID])

    if(loading) {
        return <div>Loading comparison</div>
    }
    if(error) {
        return <div>{error}</div>
    }

    if(!originalProduct || !compareProduct) {
        return <div>One of the products is not found</div>
    }

    return (
        <>
            <h1>Product Comparison</h1>

                <div className="compareGrid">
                    <div className="compareColumn">
                        <img src={originalProduct.image} alt={originalProduct.name} style={{maxWidth: "100%"}}/>
                        <Link to={`/product/${originalID}`} className="productLink">
                            <button className="GoToProduct">Go to product</button>
                        </Link>   
                        <Likes product={originalProduct} />
                        
                    </div>                  
                
                    <div className="compareColumn">
                        <img src={compareProduct.image} alt={compareProduct.name} style={{maxWidth: "100%"}}/>
                        <Link to={`/product/${comparedID}`} className="ProductLink">
                            <button className="GoToProduct">Go to product</button>
                        </Link>
                        <Likes product={compareProduct} />  
                    </div>
                </div>
        </>
    )
}