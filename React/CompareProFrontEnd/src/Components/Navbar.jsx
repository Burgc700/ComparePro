import { Link } from "react-router-dom"
import "./Navbar.css"

export function Navbar() {
    return (
        <>
            <div className="header">
                <nav className="nav">
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
                </nav>
                <label className="searchBar" htmlFor="component">Search</label>
                <input type="text" id="component" />
                <button className="searchBtn">Search</button>
            </div>
        </>
    )
}