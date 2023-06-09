import { useDispatch, useSelector } from "react-redux";
import { getCart, deleteFromCart } from "../../store/cart";
import { useEffect, useState } from "react";
import "./cart.css"
import CartQtyForm from "../CartQtyForm/"
import { useModal } from "../../context/Modal";
import { NavLink } from "react-router-dom";

function Cart() {
    const dispatch = useDispatch()
    const [isLoaded, setIsLoaded] = useState(false)
    const [display, setDisplay] = useState("")
    const [save, setSave] = useState("hidden")
    const [showModal, setShowModal] = useState(false);
    const user = useSelector(state => state.session?.user?.id)
    const sessionUser = useSelector(state => state.session?.user)

    // const handleDeleteReview = async (reviewId) => {
    //     console.log(reviewId, "67")
    //     setModalContent(<DeleteReviewModal id={reviewId} productId={id} />)
    //     openModal();
    // }

    useEffect(() => {
        dispatch(getCart(user));
        setIsLoaded(true)
    }, [dispatch, user])

    const cart = useSelector(state => state.cart)
    // console.log("***********", cart && cart);

    const cartArr = Object.values(cart)
    console.log("-----------", cart && cartArr, cart && cartArr.length);

    const onDelete = (e) => {
        console.log('delete', e.target.id);
        dispatch(deleteFromCart(user, e.target.id))
        // dispatch(getCart(user));
    }

    const { setModalContent } = useModal();

    const openModal = () => { setShowModal(true) };

    const handleEdit = (prod, save) => {
        setModalContent(<CartQtyForm prod={prod} fCls={"update"} />)
        openModal();
        // setDisplay("hidden")
        // setSave("")
    }

    const cartContent = () => {
        // console.log("length is ", cartArr.length);
        // console.log(cartArr);
        if (cartArr.length > 0) {
            return (isLoaded && cartArr && cartArr?.map(prod => {
                // console.log(prod.product.name);

                return (
                    <div className="cart-prod" key={prod?.id}>
                        <div className="product-info">
                            <NavLink
                                key={prod?.id}
                                to={`/products/${prod?.product?.id}`}
                                style={{ textDecoration: "none" }}
                                className="prod-link"
                            >
                                <div className="prod-img">
                                    <img
                                        src={
                                            prod && prod?.product?.images && prod?.product?.images[0]?.image_url
                                        }
                                        style={{ clipPath: "circle(38%)" }}
                                    />
                                </div>
                                <div className="prod-text">
                                    <div className="name">
                                        {prod?.product?.name}
                                    </div>
                                    <div className="price">
                                        $ {prod?.product?.price.toFixed(2)}
                                    </div>
                                </div>
                            </NavLink>
                        </div>
                        <div className="qty">Qty: {prod?.quantity}</div>
                        <div className="edit-section">
                            <button id={prod.id} className={display + " update-button"} onClick={() => handleEdit(prod, save)}>Edit</button>
                            <button id={prod.product?.id} className="update-button delete" onClick={onDelete}>Delete</button>
                        </div>
                    </div >
                )
            }))
        }

        return (<li>Your shopping cart is empty</li>)
    }

    return (
        <div>
            <div className="cart-page-banner">

            </div>
            {/* <div className="tester"> */}
                {/* <div className="cart-page-container"> */}
                <div className="title-container">
                    <h1>Your Shopping Cart </h1>
                </div>
                {sessionUser && user ? (<div className="cart-container-item-list">
                    {cartContent()}
                </div>) : (<h1>Please Log in to View Your Cart</h1>)}
                {/* </div> */}
            {/* </div> */}
        </div>
    )
}

export default Cart;
