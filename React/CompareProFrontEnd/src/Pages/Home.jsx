import { Recommendations } from "../Components/Recommendations"
import { AllProducts } from "../Components/AllProductCards"
import "./Home.css"

export function Home() {
 
    return (
        <>
            <div className="Layout">
                <div className="Content">
                    <Recommendations/>
                    <AllProducts/>
                </div>
            </div>
        </>
    )
}