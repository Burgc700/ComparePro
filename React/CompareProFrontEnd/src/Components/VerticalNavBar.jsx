import { useState, useEffect } from "react"
import "../Components/NavBar.css"

export function FilterPriceAndRating({page, priceValue, setPriceValue, ratingValue, setRatingValue, ApplyFilters})
{
    const priceRanges = {
        CPU: { min: 153, max: 11500, defaultPrice: 6250},
        GPU: { min: 69, max: 4600, defaultPrice: 2300},
        SSD: { min: 94, max: 1000, defaultPrice: 500},
        RAM: { min: 69, max: 405, defaultPrice: 200}
    }

    const rangeForPage = priceRanges[page] || { min: 0, max: 100, defaultPrice: 50 }
    const { min, max, defaultPrice } = rangeForPage

    useEffect(() => {
        setPriceValue(defaultPrice)
        setRatingValue(3)
    }, [page])
    

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