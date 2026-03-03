import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
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

    useEffect(() => {
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
        if(inputText.trim() !== '') {
            fetch(`http://localhost:5000/api/comments/add/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    text: inputText
                })
            })
            .then(response => response.json())
            .then(newComment => {
                setCommentList([newComment, ...commentList])
                setInputText('')
            })
            .catch(error => {
                console.error('Could not add comment: ', error)
                alert('Failed to add comment')
            })
        }
    }

    return (
        <>
            <h1 className="mainHeaders">{product.name}</h1>
            <img src={product.image} style={{ maxWidth: '100%' }}></img>
            <div className="ProductInfo">
                <h5>{product.brand}</h5>
                <h5>{product.category}</h5>
            </div>

            <h2>Comparison between sites</h2>
            <div className="priceComparison">

                {prices.map((prices, index) => (
                    <div key={index} className="productCard">
                        <h3><strong>{prices.store}</strong></h3>
                        <p>{prices.price}</p>
                        <p>{prices.rating}</p>
                        <a href={prices.url} target="_blank" rel="noopener noreferrer">
                            <button>View product from {prices.store}</button>
                        </a>
                    </div>
                ))}
            </div>
            <h2>Comments</h2>
            <div className="commentBox">
                <label className="searchBar" htmlFor="comments">Comments </label>
                <input className="comments" type="text" value={inputText} onChange={HandleInputChange}/>
                <button className="searchBtn" onClick={HandleButtonClick}>Add Comment</button>
                <div className="commentsContainer">
                    <ul className="list">
                        {commentList.map((comment) => (
                            <li key={comment.id}>
                                <p>{comment.text}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

                
        </>
    )
}