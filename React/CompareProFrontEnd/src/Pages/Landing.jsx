//Imports for components and styling used for the page and others to help render.
import { Navigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import Logo from '../assets/Logo2.0.png'
import '../Components/Navbar.css'

//Function that defines the landing page.
export function Landing() {
    //Hook used to redirect the page to the page we are going to.
    const[Redirect, setRedirect] = useState(false)

    //Defines a timer for how long the page is displayed.
    useEffect(() => {
        const redirectTimer = setTimeout(() => {
            setRedirect(true)
        }, 5000)
        return () => clearTimeout(redirectTimer)
    }, [])

    //The page we are navigating to after the timer is up.
    if(Redirect) {
        return <Navigate to="/signinsignup" replace />
    }

    //Returns the full page.
    return (
        <>
            <div className="content">
                <img className="Landingpic" src={Logo} alt="Logo"></img>
                <h1>ComparePro</h1>
                <h4>Redirecting you to an awesome page</h4>
            </div>
        </>
    )
    
}