import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import Likes from '../Components/Likes'
import "./CompareProducts.css"

export function CompareProducts() {
    const { originalID, comparedID } = useParams()
    const [ originalProduct, setOriginalProduct ] = useState(null)
    const [ compareProduct, setCompareProduct ] = useState(null)
    const [ originalComments, setOriginalComments ] = useState([])
    const [ compareComments, setCompareComments] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)
        Promise.all([
            fetch(`http://localhost:5000/api/products/ID/${originalID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/products/ID/${comparedID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/comments/${originalID}`).then(res => res.json()),
            fetch(`http://localhost:5000/api/comments/${comparedID}`).then(res => res.json())
        ])
        .then(([originalProductData, compareProductData, originalCommentsData, compareCommentData]) => {
            setOriginalProduct(originalProductData)
            setCompareProduct(compareProductData)
            setOriginalComments(originalCommentsData)
            setCompareComments(compareCommentData)
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
            <div className="comparePage">
                <h1>Product Comparison</h1>

                <div className="compareGrid">
                    <div className="compareColumn">
                        <h2>{originalProduct.name}</h2>
                        <img src={originalProduct.image} alt={originalProduct.name} style={{maxWidth: "100%"}}/>
                        <p>Brand: {originalProduct.name}</p>
                        <p>Category: {originalProduct.category}</p>
                        <p>Model Number: {originalProduct.model_num}</p>
                        <div className='featuresContainer'>
                            <ul className="featuresList">
                                {originalProduct.features
                                    ?.split("|")
                                    .map((features, i) => (
                                        <li key={i}>{features.trim()}</li>
                                    ))}
                            </ul> 
                </div>

                        <Likes product={originalProduct} />

                        <h3>Comments</h3>
                        <ul>
                            {originalComments.map((comment) => (
                                <li key={comment.id}>
                                    <strong>{comment.field || "General"}:</strong> {comment.text}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="compareColumn">
                        <h2>{compareProduct.name}</h2>
                        <img src={compareProduct.image} alt={compareProduct.name} style={{maxWidth: "100%"}}/>
                        <p>Brand: {compareProduct.name}</p>
                        <p>Category: {compareProduct.category}</p>
                        <p>Model Number: {compareProduct.model_num}</p>
                        <div className='featuresContainer'>
                            <ul className="featuresList">
                                {compareProduct.features
                                    ?.split("|")
                                    .map((features, i) => (
                                        <li key={i}>{features.trim()}</li>
                                ))}
                            </ul> 
                </div>

                        <Likes product={CompareProducts} />

                        <h3>Comments</h3>
                        <ul>
                            {compareComments.map((comment) => (
                                <li key={comment.id}>
                                    <strong>{comment.field || "General"}:</strong> {comment.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}