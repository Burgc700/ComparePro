//Imports used to help render the component.
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserButton } from '@clerk/clerk-react'
import "./Navbar.css"
import Logo from '../assets/Logo2.0.png'

//Function used to define the buttons and other navbar parts.
export function Navbar() {
    //Hook used to set the search box text.
    const [searchText, setSearchText] = useState('')
    //Variable used to change the page to the correct page if a navbutton is clicked.
    const nav = useNavigate()

    //Changes the page to the page that shows all the results matching the search criteria. Sets text box to empty.
    const HandleButtonClick = () => {
        if(searchText.trim() !== '') {
            nav(`/search?q=${searchText}`)
            setSearchText('')
        }
    }

    //How the components are displayed on the screen and the order.
    return (
        <>
            <div className="header">
                <nav className="nav">
                    <img className="logoPic" src={Logo} alt="Logo"></img>
                    <button className="navBtn">
                        <Link to="/Home">Home</Link>
                    </button>

                    <button className="navBtn">
                        <Link to="/CPU">Central Processing Unit(CPU)</Link>
                    </button>

                    <button className="navBtn">
                        <Link to="/GPU">Graphical Processing Unit(GPU)</Link>
                    </button>

                    <button className="navBtn">
                        <Link to="/SSD">Solid State Drive(SSD)</Link>
                    </button>

                    <button className="navBtn">
                        <Link to="/RAM">Random Access Memory(RAM)</Link>
                    </button>

                    <button className="navBtn">
                        <Link to="/LikedItems">Liked Items</Link>
                    </button>

                    <UserButton />
                </nav>
                <label className="searchBar" htmlFor="component" >Search</label>
                <input type="text" id="component" value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                <button className="searchBtn" onClick={HandleButtonClick}>Search</button>
            </div>
        </>
    )
}