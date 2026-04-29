//Imports for components and  styling used for the page.
import "./Home.css"
import { CategoryProducts } from "../Components/CategoryProducts"

//Function that defines the cpu page.
export function CPU() {
    //returns the full page based on the components added on the page.
    return (
        <>
            <CategoryProducts/>
        </>
    )
}