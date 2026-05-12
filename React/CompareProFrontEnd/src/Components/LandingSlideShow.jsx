//Imports needed to help render the component.
import React, { useState, useEffect } from 'react'
import "../Pages/SignInSignUp.css"
import slide1 from "../assets/CPUPage.png"
import slide3 from "../assets/Comparison.png"
import slide2 from "../assets/CommentandCompare.png"
import slide4 from "../assets/PriceComp.png"

//Function that creates a little slide show of images and tells the user what the can do on the component.
export function SlideShow() {
    //Variable that gets the images.
    const screenshots = [slide1, slide2, slide3, slide4]

    //Variable that sets the captions for each image.
    const captions = [
        "In a product page you can select minimum price and minimum rating.",
        "Add comments to products. Each product of the same category that has a comment can be selected to compare.",
        "Looks at the details of the products that are wanting to be compared.",
        "Compare the prices between the websites to find the best deal."
    ]

    //Hook that sets the image that is displayed on the page.
    const [currImage, setCurrImage] = useState(0)

    //Timer used to change the picture displayed on the page.
    useEffect(() => {
        const timer = setInterval (() => {
            setCurrImage(prev => (prev + 1) % screenshots.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [screenshots.length])

    //How the components are displayed on the screen and the order.
    return (
        <>
            <div className="Pictures">
                <div className="imageWrapper">
                    <img className="slideNumber" src={screenshots[currImage]} alt="ComparePro preview"/>
                </div>
                <h5>{captions[currImage]}</h5>
            </div>
        </>
    )
}