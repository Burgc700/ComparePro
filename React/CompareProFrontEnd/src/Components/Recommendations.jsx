//Imports used to help render the component.
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import Likes from '../Components/Likes'
import "../Pages/Home.css"

//Function that gets the recommended products for that user.
export function Recommendations() {
    //Hooks used to help set the data on the page.
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const[recommendations, setRecommendations] = useState([])
    //Parameter that helps gets the recommendation for the right user based on what they have viewed.
    const {user, isSignedIn} = useUser()

    useEffect(() => {
        //Checks to make sure the user is signed in before any recommendations get returned.
        if(isSignedIn && user) {
            //Fetches the recommendations for the user based of their user id.
            fetch(`http://localhost:5000/api/recommendations/${user.id}`)
                .then(response => {
                    if(!response.ok) {
                        throw new Error(`HTTP error: ${response.status}`)
                    }
                    return response.json()
                })
                //Renders the recommendations on the page.
                .then(data => {
                    setRecommendations(data)
                    setLoading(false)
                })
                .catch(error => {
                    console.error("Recommendations error:", error)
                    setError(error.message)
                    setLoading(false)
                })
        }
        else {
            setLoading(false)
        }
    }, [isSignedIn, user])

    //Returned when recommendations are loading on the page.
    if(loading) {
        return <div>Loading all products</div>
    }

    //If an error is returned the error message gets printed on the page.
    if(error) {
        return <div>Error: {error}</div>
    }

    //How the components are displayed on the screen and the order.
    return (
        <>
            <h1 className="mainHeaders">Recommended for you</h1>
            <div className="AllProducts">
                {recommendations.map((product) => (
                    <div key={product.id} className="productCard">
                        <Link to={`/product/${product.id}`} key={product.id} className="productLink">
                            <img className='productimg' src={product.image} alt={product.name} style={{maxWidth: '100%'}}/>
                            <p>{product.name}</p>
                            <p>Brand: {product.brand}</p>
                            <p>Category: {product.category}</p>
                        </Link>
                        <Likes product={product} />
                    </div>
                    
                ))}
            </div>
        </>
    )
}