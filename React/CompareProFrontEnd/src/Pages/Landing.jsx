import { Navigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Logo from '../assets/Logo2.0.jpg'
import '../Components/Navbar.css'

export function Landing() {
    const[Redirect, setRedirect] = useState(false)

    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            setRedirect(true)
        }, 5000)
        return () => clearTimeout(redirectTimer)
    }, [])

    if(Redirect) {
        return <Navigate to="/signinsignup" replace />
    }

    return (
        <>
            <div className="content">
                <img className="Landingpic" src={Logo} alt="Logo"></img>
                <h1>ComparePro</h1>
                <h4>Redirecting you an awesome page</h4>
            </div>
        </>
    )
    
}