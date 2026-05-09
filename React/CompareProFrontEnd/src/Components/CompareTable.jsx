//Imports needed to help render the items on the UI.
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import "../Pages/CompareProducts.css"

//Function to create the table on the compare page between products.
export function CompareTable() {
    //Parameters used for the two products being compared. original is the one just being viewed and compared is the product selected in the drop down box.
    const { originalID, comparedID } = useParams()
    //Hooks used to set the data in the right place for the UI.
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ originalProduct, setOriginalProduct ] = useState(null)
    const [ compareProduct, setCompareProduct ] = useState(null)
    const [ originalComments, setOriginalComments ] = useState([])
    const [ compareComments, setCompareComments] = useState([])
    const [ originalPrice, setOriginalPrice ] = useState([])
    const [ comparePrice, setComparePrice ] = useState([])
    const { user, isLoaded, isSignedIn } = useUser()
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        setLoading(true)
        setError(null)
        if (!isLoaded) return
        if (!isSignedIn || !user) return
        //Gets all the data for the products being compared for the items we need in the table.
        Promise.all([
            fetch(`${API_URL}/api/products/ID/${originalID}`).then(res => res.json()),
            fetch(`${API_URL}/api/products/ID/${comparedID}`).then(res => res.json()),
            fetch(`${API_URL}/api/comments/${originalID}?user_id=${user.id}`).then(res => res.json()),
            fetch(`${API_URL}/api/comments/${comparedID}?user_id=${user.id}`).then(res => res.json()),
            fetch(`${API_URL}/api/prices/${originalID}`).then(res => res.json()),
            fetch(`${API_URL}/api/prices/${comparedID}`).then(res => res.json()),

        ])
        //Sets all the data in the table based off what was fetched.
        .then(([originalProductData, compareProductData, originalCommentsData, compareCommentData, originalPriceData, comparePriceData]) => {
            setOriginalProduct(originalProductData)
            setCompareProduct(compareProductData)
            setOriginalComments(originalCommentsData)
            setCompareComments(compareCommentData)
            setOriginalPrice(originalPriceData)
            setComparePrice(comparePriceData)
            setLoading(false)
        })
        .catch(error => {
            console.error("Error with Compare page:", error)
            setError("Could not load comparison")
            setLoading(false)
        })
    }, [originalID, comparedID, API_URL, isLoaded, isSignedIn, user])

    //Returns when the table is loading on the display.
    if(loading) {
        return <div>Loading table</div>
    }

    //Returns an error with the message if an error occurs.
    if(error) {
        return <div>{error}</div>
    }

    //How the components are displayed on the screen and the order.
    return (
        <>
             <div className="compareTable">
                    <table className="table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{originalProduct.name}</th>
                                <th>{compareProduct.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th><strong>Brand</strong></th>
                                <td>{originalProduct.brand}</td>
                                <td>{compareProduct.brand}</td>
                            </tr>

                            <tr>
                                <th><strong>Prices</strong></th>
                                <td>
                                    {originalPrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{(price.store)
                                                .replace(/\b\w/g, char => char.toUpperCase())       
                                            }</strong> ${price.price}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {comparePrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{(price.store)
                                                .replace(/\b\w/g, char => char.toUpperCase())       
                                            }</strong> ${price.price}
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th><strong>Ratings</strong></th>
                                <td>
                                    {originalPrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{(price.store)
                                                .replace(/\b\w/g, char => char.toUpperCase())       
                                            }</strong> ${price.price}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {comparePrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{(price.store)
                                                .replace(/\b\w/g, char => char.toUpperCase())       
                                            }</strong> ${price.price}
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th><strong>Features</strong></th>
                                <td>
                                    <ul>
                                        {originalProduct.features
                                        ?.split("|")
                                        .map((f, i) => (
                                            <li key={i}>{f.trim()}</li>
                                        ))}
                                    </ul>
                                </td>

                                <td>
                                    <ul>
                                        {compareProduct.features
                                        ?.split("|")
                                        .map((f, i) => (
                                            <li key={i}>{f.trim()}</li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>

                            <tr>
                                <th><strong>Features</strong></th>
                                <td>
                                    <ul>
                                        {originalComments.map((comment) => (
                                            <li key={comment.id}>
                                                <strong>{(comment.field || "General")
                                            .replaceAll("_", " ")
                                            .replace(/\b\w/g, char => char.toUpperCase())}   
                                        </strong> {comment.text}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {compareComments.map((comment) => (
                                            <li key={comment.id}>
                                                <strong>{(comment.field || "General")
                                            .replaceAll("_", " ")
                                            .replace(/\b\w/g, char => char.toUpperCase())}   
                                        </strong> {comment.text}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </>
    )
}