//Imports needed to help render the component
import { useState, useEffect } from "react"
import "../Components/NavBar.css"

//Function that displays and sets the range for what the user is wanting to look at.
//page, priceValue, setPriceValue, ratingValue, setRatingValue, ApplyFilters are all props that get the data from another component so it is all displayed the same on every page using it.
export function FilterPriceAndRating({page, priceValue, setPriceValue, ratingValue, setRatingValue, ApplyFilters})
{
    //Sets the min, max and default for the range of prices for that category.
    const priceRanges = {
        CPU: { min: 153, max: 11500, defaultPrice: 6250},
        GPU: { min: 69, max: 4600, defaultPrice: 2300},
        SSD: { min: 94, max: 1000, defaultPrice: 500},
        RAM: { min: 69, max: 405, defaultPrice: 200}
    }

    //Default range for each page before the page gets rendered.
    const rangeForPage = priceRanges[page] || { min: 0, max: 100, defaultPrice: 50 }
    //Sets the priceRanges for the page we are on.
    const { min, max, defaultPrice } = rangeForPage

    //Sets the value when the user slides the slider for the filter.
    useEffect(() => {
        setPriceValue(defaultPrice)
        setRatingValue(3)
    }, [page])
    
    //How the components are displayed on the screen and the order.
    return (
        <>
            <div className="VerticalNavBar">
                <input className="SlideBar" type="range" min={min} max={max} value={priceValue ?? min}
                    onChange={(e) => setPriceValue(Number(e.target.value))}/>
                <h5>Minimum Price: {priceValue}</h5>

                <input className="SlideBar" type="range" min="0" max="5" value={ratingValue}
                    onChange={(e) => setRatingValue(Number(e.target.value))}/>
                <h5>Minimum Rating: {ratingValue}</h5>

                <button className="filterBtn" onClick={ApplyFilters}>Filter Products</button>
            </div>
        </>
    )
}