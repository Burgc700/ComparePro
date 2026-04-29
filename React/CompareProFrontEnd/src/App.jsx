//Imports for paths to other pages.
import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Landing } from "./Pages/Landing"
import { Home } from "./Pages/Home"
import SignInSignUp from "./Pages/SignInSignUp"
import { Layout } from "./Components/Layout"
import { ProductPerSite } from "./Pages/ProductPerSite"
import { SearchResults } from "./Pages/SearchResults"
import { CompareProducts } from "./Pages/CompareProducts"
import LikedItems from "./Pages/LikedItems"
import './App.css'
import { CategoryProducts } from "./Components/CategoryProducts"

//Function that holds all the routes to other pages.
export default function App() {
  //The routes to all other paths or the website.
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signinsignup" element={<SignInSignUp />} />
        <Route path="/product/:id" element={<ProductPerSite />} />
        <Route path="/search" element={<SearchResults/>}/>
        <Route path="/compare/:originalID/:comparedID" element={<CompareProducts />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/:category" element={<CategoryProducts  />} />
          <Route path="/LikedItems" element={<LikedItems />} />
        </Route>
      </Routes>
    </Router>
  )
}

