//Imports for components and styling used for the page. Also other imports to help render the page.
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { PriceComparison } from "../Components/PriceComparison"
import { IndividualProductInfo } from "../Components/IndividualProductInfo"
import { CommentsAndFields } from "../Components/CommentsAndFields"
import { CompareProducts } from "../Components/CompareProducts"
import { Navbar } from "../Components/Navbar"
import "./ProductPerSite.css"
import "../Components/Navbar.css"

//Function for the page that loads all products for a certain category from the navbar.
export function ProductPerSite() {
    //Parameter to get the right id of the product the user wants to look at.
    const { id } = useParams()
    //Gets the user that is currently logged in to track which products have been viewed for the recommendations.
    const { user, isSignedIn } = useUser()
    //Hooks used to set the the data that is being displayed on the page.
    const [refreshCompareList, setRefreshCompareList] = useState(0)
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const API_URL = import.meta.env.VITE_API_URL

    //Effect that sends a post request to the database when a user views a product.
    useEffect(() => {
        if(user && isSignedIn) {
            fetch(`${API_URL}/api/track-view/${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: user.id})
            })
        }
    },[id, isSignedIn, user])

    //Get request that gets the product info for the category tab that has been selected.
    useEffect(() => {
        fetch(`${API_URL}/api/products/ID/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data)
                setLoading(false)
            })
    }, [id])

    //Returns when the page is loading.
    if(loading) {
        return <div>Loading...</div>
    }
    
    //Helper method that refreshes the comment list when a comment is added to that product page.
    function HandleAddNewComment() {
        setRefreshCompareList(prev => prev + 1)
    }

    //Returns the full page based on the components added to render the page.
    return (
        <>
            <Navbar></Navbar>

            <IndividualProductInfo product={product}/>

            <CompareProducts refreshList={refreshCompareList}/>
                        
            <PriceComparison productName={product.name}/>
           
            <CommentsAndFields onCommentAdd={HandleAddNewComment}/>
        </>
    )
}