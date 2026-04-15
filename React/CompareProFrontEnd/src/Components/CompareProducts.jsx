import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import "../Pages/ProductPerSite.css"


export function CompareProducts() {
    const { id } = useParams()
    const [ product, setProduct ] = useState(null)
    const [ compareComment, setCompareComment ] = useState([])
    const [ compareProduct, setCompareProduct ] = useState([])
    const [ selectedToCompare, setSelectedToCompare ] = useState("")

      const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:5000/api/comments/compare/${id}`)
            .then(response => response.json())
            .then(data => {
                setCompareComment(data)
                const sameCategory = []
                const seen = new Set()
                data.forEach((item) => {
                    if(!seen.has(item.product_id)) {
                        seen.add(item.product_id)
                        sameCategory.push({
                            product_id: item.product_id,
                            product_name: item.product_name
                        })
                    }
                })
                setCompareProduct(sameCategory)
            })
            .catch(error => console.error("Compare comments error: ", error))
        
    }, [id])

      const HandleCompareClick = () => {
                if(!selectedToCompare) {
            alert("Select a product to compare.")
            return
        }
        navigate(`/compare/${id}/${selectedToCompare}`)
    }

    return (
        <>
             <div>
                <label htmlFor="compareProduct">Compare with: </label>
                    <select id="compareProduct" value={selectedToCompare} onChange={(e) => setSelectedToCompare(e.target.value)}>
                        <option value="">Select a product to compare</option>
                        {compareProduct.map((product) => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.product_name}
                            </option>
                        ))}
                    </select>
                <button className='searchBtn' onClick={HandleCompareClick}>Compare</button>
            </div>
        </>
    )
}