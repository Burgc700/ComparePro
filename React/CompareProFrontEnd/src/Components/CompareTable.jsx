import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import "../Pages/CompareProducts.css"

export function CompareTable() {
    const { originalID, comparedID } = useParams()
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ originalProduct, setOriginalProduct ] = useState(null)
    const [ compareProduct, setCompareProduct ] = useState(null)
    const [ originalComments, setOriginalComments ] = useState([])
    const [ compareComments, setCompareComments] = useState([])
    const [ originalPrice, setOriginalPrice ] = useState([])
    const [ comparePrice, setComparePrice ] = useState([])

    useEffect(() => {
        setLoading(true)
        setError(null)
        Promise.all([
            fetch(`http://localhost:5000/api/products/ID/${originalID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/products/ID/${comparedID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/comments/${originalID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/comments/${comparedID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/prices/${originalID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/prices/${comparedID}`).then(res => res.json()),

        ])
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
    }, [originalID, comparedID])

    if(loading) {
        return <div>Loading table</div>
    }
    if(error) {
        return <div>{error}</div>
    }

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
                                <th>Brand</th>
                                <td>{originalProduct.brand}</td>
                                <td>{compareProduct.brand}</td>
                            </tr>

                            <tr>
                                <th>Prices</th>
                                <td>
                                    {originalPrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{price.store}</strong> ${price.price}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {comparePrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{price.store}</strong> ${price.price}
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th>Ratings</th>
                                <td>
                                    {originalPrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{price.store}</strong> {price.rating}
                                        </div>
                                    ))}
                                </td>
                                <td>
                                    {comparePrice.map((price, i) => (
                                        <div key={i}>
                                            <strong>{price.store}</strong> {price.rating}
                                        </div>
                                    ))}
                                </td>
                            </tr>

                            <tr>
                                <th>Features</th>
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
                                <th>Comments</th>
                                <td>
                                    <ul>
                                        {originalComments.map((comment) => (
                                            <li key={comment.id}>
                                                <strong>{comment.field || "General"}:</strong> {comment.text}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        {compareComments.map((comment) => (
                                            <li key={comment.id}>
                                                <strong>{comment.field || "General"}:</strong> {comment.text}
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