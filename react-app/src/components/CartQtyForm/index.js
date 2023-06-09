import { useState } from "react"
import { addProdToCart, updateQty } from "../../store/cart"
import { useDispatch, useSelector } from "react-redux";
import "./cartForm.css"
import { useModal } from "../../context/Modal";

export default function CartQtyForm({ prod, fCls }) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.session.user.id)
    const [qty, setQty] = useState(prod.quantity)
    const { closeModal } = useModal()
    // console.log(prod.product_id, "product");
    console.log(fCls);
    console.log(qty, "quantity");

    const updateFQty = (e) => {
        console.log(e.target.id);
        setQty(e.target.value)

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newCartRel = {
            prodId: prod.product_id,
            user,
            qty
        }

        if (fCls === "add") {
            console.log("dispatching add");
            dispatch(addProdToCart(newCartRel))
        } else if (fCls === "update") {
            console.log("dispatching update");
            dispatch(updateQty(newCartRel))
        }

        closeModal()

        // setDisplay("hidden")
    }

    return (
        <div className="cart-form-containter">
            <div className="cart-form-title">
                <h1>How many would you like to buy?</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="qty-input-container">
                    <label for="quantity-input">Qty:</label>
                    <input id="quantity-input" type="number" step={1} placeholder={qty} min={1} max={15} value={qty} onChange={updateFQty}></input>
                    <button className="cart-save-button" type="submit">Save</button>
                </div>
            </form>

        </div>
    )
}
