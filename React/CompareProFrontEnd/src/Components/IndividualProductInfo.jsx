//Imports needed to help render items on the component.
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import Likes from '../Components/Likes'
import "../Pages/ProductPerSite.css"

//Function that gets the product info for a product selected from one of the pages in the navbar.
export function IndividualProductInfo({product}) {
    //If that product is not found in the database the following is returned.
    if (!product) {
        return <div>Product not found</div>
    }

    //How the components are displayed on the screen and the order.
    return (
        <>
            <div className="Top">
                <h1 className="mainHeaders">{product.name}</h1>
            </div>
            <div className='ProductImg'>
                <img src={product.image} style={{ maxWidth: '100%' }}></img>
            </div>
            <div className="ProductInfo">
                <h5 className="generalInfo">Brand: {product.brand}</h5>
                <h5 className="generalInfo">Category: {product.category}</h5>
                <h5 className="generalInfo">Model Number: {product.model_num}</h5>
                <div className='featuresContainer'>
                    <ul className="featuresList">
                        {product.features
                            ?.split("|")
                            .map((features, i) => (
                                <li key={i}>{features.trim()}</li>
                            ))}
                    </ul> 
                </div>
            </div>

            <div>
                <Likes product={product} />
            </div>
        </>
    )
}