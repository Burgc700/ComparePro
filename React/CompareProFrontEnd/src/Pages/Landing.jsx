import { Navigate } from "react-router-dom"
import { useState, useEffect } from 'react'

export function Landing() {
    const[Redirect, setRedirect] = useState(false)

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            setRedirect(true)
        }, 5000)
        return () => clearTimeout(redirectTimer)
    }, [])

    if(Redirect) {
        return <Navigate to="/home" replace />
    }

    return (
        <>
            <h1>Landing</h1>
        </>
    )
    
}