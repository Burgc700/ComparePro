import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import Likes from '../Components/Likes'
import "./ProductPerSite.css"
import "../Components/Navbar.css"

export function ProductPerSite() {
    const { id } = useParams()
    const { user, isSignedIn } = useUser()
    const [ product, setProduct ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ prices, setPrices ] = useState([])
    const [ inputText, setInputText ] = useState('')
    const [ commentList, setCommentList ] = useState([])
    const [ selectField, setSelectField] = useState("pro")
    const [ customField, setCustomField ] = useState("")
    const [ compareComment, setCompareComment ] = useState([])
    const [ compareProduct, setCompareProduct ] = useState([])
    const [ selectedToCompare, setSelectedToCompare ] = useState("")

    const navigate = useNavigate()

    useEffect(() => {
        setCommentList([])
        setLoading(true)
        fetch(`http://localhost:5000/api/products/ID/${id}`)
            .then(response => response.json())
            .then(data => {
                setProduct(data)
                setLoading(false)
            })
            .catch(error => {
                setError(error.message)
                setLoading(false)
            })

        fetch(`http://localhost:5000/api/prices/${id}`)
            .then(response => response.json())
            .then(data => setPrices(data))
            .catch(error => console.error('Price fetch error: ', error))

        fetch(`http://localhost:5000/api/comments/${id}`)
            .then(response => response.json())
            .then(data => setCommentList(data))
            .catch(error => console.error('Can not fetch comments: ', error))
    }, [id])

    useEffect(() => {
        if(product && isSignedIn) {
            fetch(`http://localhost:5000/api/track-view/${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: user.id})
            })
        }
    },[product, id, isSignedIn, user])

    useEffect(() => {
        if(product) {
            fetch(`http://localhost:5000/api/comments/compare/${id}`)
                .then(response => response.json())
                .then(data => {
                    setCompareComment(data)
                    const sameCategory = []
                    const seen = new Set()
                    data.forEach((item) => {
                        if(!seen.has(item.product_id)) {
                            seen.add(item.product_id)
                            sameCategory.push({
                                product_id: item.product_id,
                                product_name: item.product_name
                            })
                        }
                    })
                    setCompareProduct(sameCategory)
                })
                .catch(error => console.error("Compare comments error: ", error))
        }
    }, [product, id])

    if (loading) {
        return <div>Loading products...</div>
    }
    if (error) {
        return <div>Error: {error}</div>
    }
    if (!product) {
        return <div>Product not found</div>
    }

    const HandleInputChange = (event) => {
        setInputText(event.target.value)
    }

    const HandleButtonClick = () => {
        if(!isSignedIn){
            alert('Sign in to comment')
            return
        }
        const finalField = selectField === "custom" ? customField : selectField
        if(inputText.trim() !== '') {
            fetch(`http://localhost:5000/api/comments/add/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    field: finalField,
                    text: inputText
                })
            })
            .then(response => response.json())
            .then(newComment => {
                setCommentList(prev => [newComment, ...prev])
                setInputText('')
            })
            .catch(error => {
                console.error('Could not add comment: ', error)
                alert('Failed to add comment')
            })
        }
    }

    const HandleCompareClick = () => {
                if(!selectedToCompare) {
            alert("Select a product to compare.")
            return
        }
        navigate(`/compare/${id}/${selectedToCompare}`)
    }

    return (
        <>
            <div className="Top">
                <h1 className="mainHeaders">{product.name}</h1>
            </div>
            <div className='ProductImg'>
                <img src={product.image} style={{ maxWidth: '100%' }}></img>
            </div>
            <div className="ProductInfo">
                <h5>Brand: {product.brand}</h5>
                <h5>Category: {product.category}</h5>
                <h5>Model Number: {product.model_num}</h5>
                <div className='featuresContainer'>
                    <ul className="featuresList">
                        {product.features
                            ?.split("|")
                            .map((features, i) => (
                                <li key={i}>{features.trim()}</li>
                            ))}
                    </ul> 
                </div>
            </div>

            <div>
                <Likes product={product} />
            </div>
            <div>
                <label htmlFor="compareProduct">Compare with: </label>
                    <select id="compareProduct" value={selectedToCompare} onChange={(e) => setSelectedToCompare(e.target.value)}>
                        <option value="">Select a product to compare</option>
                        {compareProduct.map((product) => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.product_name}
                            </option>
                        ))}
                    </select>
                <button className='searchBtn' onClick={HandleCompareClick}>Compare</button>
            </div>

            <h2>Comparison between sites</h2>
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
            <h2>Comments</h2>
            <div className="commentBox">
                <label className='searchBar' htmlFor='fields'>Field</label>
                <select className='selectField' value={selectField} onChange={(e) => setSelectField(e.target.value)}>
                    <option value="general_comment">General Comment</option>
                    <option value="pro">Pro</option>
                    <option value="con">Con</option>
                    <option value="purpose">Purpose(gaming, workstation, ect.)</option>
                    <option value="build">Build Quality</option>
                    <option value='custom'>Make your own</option>
                </select>
                {selectField === "custom" && (
                    <>
                        <label className="searchBar" htmlFor="customField">Custom Field</label>
                        <input id="customField" className="comments" type="text" onChange={(e) => setCustomField(e.target.value)} placeholder="Enter your own field"/>
                    </>
                )}
                <label className="searchBar" htmlFor="comments">Comments </label>
                <input className="comments" type="text" value={inputText} onChange={HandleInputChange}/>
                <button className="searchBtn" onClick={HandleButtonClick}>Add Comment</button>
                {/* <label htmlFor="compareProduct">Compare with:</label>
                <select id="compareProduct" value={selectedToCompare} onChange={(e) => setSelectedToCompare(e.target.value)}>
                    <option value="">Select a product to compare</option>
                    {compareProduct.map((product) => (
                        <option key={product.product_id} value={product.product_id}>
                            {product.product_name}
                        </option>
                    ))}
                </select> */}
                <div className="commentsContainer">
                    <ul className="list">
                        {commentList.map((comment) => (
                            <li key={comment.id}>
                                <p><strong>{comment.field}</strong> {comment.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}