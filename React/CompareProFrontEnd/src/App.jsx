import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Landing } from "./Pages/Landing"
import { Home } from "./Pages/Home"
import SignInSignUp from "./Pages/SignInSignUp"
import { CPU } from "./Pages/CPU"
import { GPU } from "./Pages/GPU"
import { RAM } from "./Pages/RAM"
import { SSD } from "./Pages/SSD"
import { Layout } from "./Components/Layout"
import { ProductPerSite } from "./Pages/ProductPerSite"
import './App.css'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signinsignup" element={<SignInSignUp />} />
        <Route path="/product/:id" element={<ProductPerSite />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/cpu" element={<CPU />} />
          <Route path="/gpu" element={<GPU />} />
          <Route path="/ram" element={<RAM />} />
          <Route path="/ssd" element={<SSD />} />
        </Route>
      </Routes>
    </Router>
  )
}

