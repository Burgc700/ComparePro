//Imports needed to help the render the component.
import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Likes from '../Components/Likes'
import "../Pages/CompareProducts.css"

//Function that gets the images for the products getting compared.
export function CompareProductsImageCard() {
    //Parameters used for the two products being compared. original is the one just being viewed and compared is the product selected in the drop down box.
    const { originalID, comparedID } = useParams()
    //Hooks that help set the data to the UI.
    const [ originalProduct, setOriginalProduct ] = useState(null)
    const [ compareProduct, setCompareProduct ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

        useEffect(() => {
            setLoading(true)
            setError(null)
            //Makes sure it gets all the data for the products being compared.
            Promise.all([
                fetch(`http://localhost:5000/api/products/ID/${originalID}`).then(res => res.json()),
                fetch(`http://localhost:5000/api/products/ID/${comparedID}`).then(res => res.json())
            ])
            //Sets data that is needed to be displayed on the screen.
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

    //Returns when the comparison is loading.
    if(loading) {
        return <div>Loading comparison</div>
    }

    //Returned when there is an error loading the page.
    if(error) {
        return <div>{error}</div>
    }

    //Makes sure that both products are found the in the database.
    if(!originalProduct || !compareProduct) {
        return <div>One of the products is not found</div>
    }

    //How the components are displayed on the screen and the order.
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