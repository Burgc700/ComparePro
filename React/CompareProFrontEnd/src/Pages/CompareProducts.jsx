//Components used for the page.
import { CompareTable } from "../Components/CompareTable"
import { CompareProductsImageCard } from "../Components/CompareProductsImageCard"
import "./CompareProducts.css"

//Function that defines the page.
export function CompareProducts() {
    //Returns all the components for the page.
    return (
        <>
            <div className="comparePage">
                <CompareProductsImageCard/>
                <CompareTable/>
            </div>
        </>
    )
}