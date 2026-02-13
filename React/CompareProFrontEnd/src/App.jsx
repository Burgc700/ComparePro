import { BrowserRouter as Router, Routes, Route} from "react-router-dom"
import { Landing } from "./Pages/Landing"
import { Home } from "./Pages/Home"
import { SignInSignUp } from "./Pages/SignInSignUp"
import './App.css'

export default function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signinsignup" element={<SignInSignUp />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  )
}

