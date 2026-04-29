import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import "../Pages/ProductPerSite.css"

export function CommentsAndFields({onCommentAdd}) {
    const { id } = useParams()
    const { user, isSignedIn } = useUser()
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
    const [ inputText, setInputText ] = useState('')
    const [ commentList, setCommentList ] = useState([])
    const [ selectField, setSelectField] = useState("pro")
    const [ customField, setCustomField ] = useState("")

    useEffect(() => {
        setCommentList([])
        setLoading(true)
        setError(null)
        fetch(`http://localhost:5000/api/comments/${id}`)
            .then(response => response.json())
            .then(data => { 
                setCommentList(data)
                setLoading(false)
            })
            .catch(error => console.error('Can not fetch comments: ', error))
    }, [id])

    if(loading) {
        return <div>Comments Loading</div>
    }

    if(error) {
        return <div>Error: {error}</div>
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
                if(onCommentAdd) {
                    onCommentAdd()
                }
            })
            .catch(error => {
                console.error('Could not add comment: ', error)
                alert('Failed to add comment')
            })
        }
    }

    return (
        <>
            <h2 className="subheader">Comments</h2>
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
            
                <div className="commentsContainer">
                    <ul className="list">
                        {/* {commentList.map((comment) => (
                            <li key={comment.id}>
                                <p><strong>{comment.field}</strong> {comment.text}</p>
                            </li>
                        ))} */}
                        {[...commentList]
                            .sort((a, b) => (a.field || "General").localeCompare(b.field || "General"))
                            .map((comment) => (
                                <li key={comment.id}>
                                    <p>
                                        <strong>{comment.field || "General"}</strong> {comment.text}
                                    </p>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </>
    )
}       