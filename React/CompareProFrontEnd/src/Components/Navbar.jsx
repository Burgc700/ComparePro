import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserButton } from '@clerk/clerk-react'
import "./Navbar.css"
import Logo from '../assets/Logo2.0.jpg'

export function Navbar() {
    const [searchText, setSearchText] = useState('')
    const nav = useNavigate()

    const HandleButtonClick = () => {
        if(searchText.trim() !== '') {
            nav(`/search?q=${searchText}`)
            setSearchText('')
        }
    }

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