import React, { useState, useEffect } from 'react'
import "../Pages/SignInSignUp.css"
import slide1 from "../assets/CPUPage.png"
import slide3 from "../assets/Comparison.png"
import slide2 from "../assets/CommentandCompare.png"

export function SlideShow() {
    const screenshots = [slide1, slide2, slide3]

    const captions = [
        "In a product page you can select minimum price and minimum rating",
        "Add comments to products. Each product of the same category that has a comment can be selected to compare",
        "Looks at the details of the products that are wanting to be compared."
    ]

    const [currImage, setCurrImage] = useState(0)

    useEffect(() => {
        const timer = setInterval (() => {
            setCurrImage(prev => (prev + 1) % screenshots.length)
        }, 3000)
        return () => clearInterval(timer)
    }, [screenshots.length])

    return (
        <>
            <div className="Pictures">
                <img className="slideNumber" src={screenshots[currImage]} alt="ComparePro preview"/>
                <h5>{captions[currImage]}</h5>
            </div>
        </>
    )
}