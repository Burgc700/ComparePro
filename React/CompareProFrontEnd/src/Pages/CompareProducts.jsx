import { CompareTable } from "../Components/CompareTable"
import { CompareProductsImageCard } from "../Components/CompareProductsImageCard"
import "./CompareProducts.css"

export function CompareProducts() {

    return (
        <>
            <div className="comparePage">
                <CompareProductsImageCard/>
                <CompareTable/>
            </div>
        </>
    )
}