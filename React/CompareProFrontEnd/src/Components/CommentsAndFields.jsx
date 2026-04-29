//Imports needed to help display items.
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import "../Pages/ProductPerSite.css"

//Function to get and set all comments and fields that the user wants to add.
export function CommentsAndFields({onCommentAdd}) {
    //Parameter to make sure the comment gets added to the right product id.
    const { id } = useParams()
    //Parameter to make sure the user that is logged in gets only the comments they have posted to the products that have been commented on by them.
    const { user, isSignedIn } = useUser()
    //Hooks to help set the data displayed is the UI.
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
        //Get request to get the comments for a certain product if that product has comments with it.
        fetch(`http://localhost:5000/api/comments/${id}`)
            .then(response => response.json())
            .then(data => { 
                setCommentList(data)
                setLoading(false)
            })
            .catch(error => console.error('Can not fetch comments: ', error))
    }, [id])

    //Returns when the comments are loading.
    if(loading) {
        return <div>Comments Loading</div>
    }

    //Returned if an error occurs with the message of the error.
    if(error) {
        return <div>Error: {error}</div>
    }

    //Method that adds the text from the user key strokes to the text box in the UI.
    const HandleInputChange = (event) => {
        setInputText(event.target.value)
    }

    //When the button is clicked the text box will be cleared and the comment and field should be displayed in the box for comments.
    const HandleButtonClick = () => {
        if(!isSignedIn){
            alert('Sign in to comment')
            return
        }
        //Special case when the user wants to add a field to the comments that aren't already in the list.
        const finalField = selectField === "custom" ? customField : selectField
        if(inputText.trim() !== '') {
            //Post request that sends the comment and field to the database for that user so it gets displayed the next the user views that product.
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
            //Adds the comment to the database.
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

     //How the components are displayed on the screen and the order.
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