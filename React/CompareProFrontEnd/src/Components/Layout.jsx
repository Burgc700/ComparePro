//Imports used to help render the component.
import { Navbar } from "./Navbar"
import { Outlet } from "react-router-dom"

//Function that defines the layout for the navbar.
export function Layout() {
    //How the components are displayed on the screen and the order.
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    )
}