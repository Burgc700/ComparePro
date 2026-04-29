//Imports needed to help the component render.
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import "../Pages/ProductPerSite.css"

//Function to help find the other products of the same category that also have a comment.
//regreshList is a prop that refreshes the list for that category so all products of the same category are displayed in the drop down.
export function CompareProducts({refreshList}) {
    //Parameter that gets the id's of the other products that should be populated in the drop down.
    const { id } = useParams()
    //Hooks that help set the data for the page.
    const [ product, setProduct ] = useState(null)
    const [ compareComment, setCompareComment ] = useState("")
    const [ compareProduct, setCompareProduct ] = useState([])
    const [ selectedToCompare, setSelectedToCompare ] = useState("")

    //variable that navigates or changes the page to the compare page after the button is clicked.
    const navigate = useNavigate()

    useEffect(() => {
        //Gets all the other products  of the same category that have a comment.
        fetch(`http://localhost:5000/api/comments/compare/${id}`)
            .then(response => response.json())
            //Helps ensure that the data getting added to the to drop down is valid.
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
        
    }, [id, refreshList])

    //When the button is clicked makes sure a product is selected and changes the page and renders the two products being compared.
    const HandleCompareClick = () => {
                if(!selectedToCompare) {
            alert("Select a product to compare.")
            return
        }
        navigate(`/compare/${id}/${selectedToCompare}`)
    }

    //How the components are displayed on the screen and the order.
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