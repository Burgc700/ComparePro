import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import { PriceComparison } from "../Components/PriceComparison"
import { IndividualProductInfo } from "../Components/IndividualProductInfo"
import { CommentsAndFields } from "../Components/CommentsAndFields"
import { CompareProducts } from "../Components/CompareProducts"
import "./ProductPerSite.css"
import "../Components/Navbar.css"

export function ProductPerSite() {
    const { id } = useParams()
    const { user, isSignedIn } = useUser()

    useEffect(() => {
        if(user && isSignedIn) {
            fetch(`http://localhost:5000/api/track-view/${id}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({user_id: user.id})
            })
        }
    },[id, isSignedIn, user])

    return (
        <>
            <IndividualProductInfo/>

            <CompareProducts/>
                        
            <PriceComparison/>
           
            <CommentsAndFields/>
        </>
    )
}