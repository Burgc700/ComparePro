//Imports for components and styling used for the page.
import { Recommendations } from "../Components/Recommendations"
import { AllProducts } from "../Components/AllProductCards"
import "./Home.css"

//Function that defines the home page.
export function Home() {
    //Returns the full page based on the components added on the return.
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