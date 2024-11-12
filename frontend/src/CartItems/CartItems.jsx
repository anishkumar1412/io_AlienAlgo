import React, { useContext, useState } from 'react';
import './CartItems.css';
import { ShopContext } from '../Components/Context/ShopContext';
import remove_icon from '../assets/Frontend_Assets/cart_cross_icon.png';

function CartItems() {
    const { getTotalCartAmount, all_product, cartItems, removeFromCart } = useContext(ShopContext);

    // Order state to hold customer information and cart details
    const [order, setOrder] = useState({
        customerName: "",
        address: "",
        city: "",
        pin: "",
        paymentMethod: "",
        quantity: 0, // Default initial quantity
        total: getTotalCartAmount(),
        products: [] // For holding product details
    });

    // Handle input changes for customer details
    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder({ ...order, [name]: value });
    };

    // Function to collect the product details for each cart item
    const getProductDetails = () => {
        return all_product
            .filter(product => cartItems[product.id] > 0)  // Only include products that are in the cart
            .map(product => ({
                id: product.id,
                name: product.name,
                price: product.new_price,
                quantity: cartItems[product.id],
                total: product.new_price * cartItems[product.id],
                image: product.image // Include image URL here
            }));
    };

    // Handle the "Place Order" button click
    const handlePlaceOrder = async () => {
        // Calculate total quantity of items in the cart before placing the order
        const totalQuantity = getProductDetails().reduce((acc, item) => acc + item.quantity, 0);

        // Update order state with product details, total quantity, and total amount
        const updatedOrder = {
            ...order,
            products: getProductDetails(),  // Include product details in the order
            quantity: totalQuantity,
            total: getTotalCartAmount()
        };

        // Make the API request to send order data to backend
        const response = await fetch('http://localhost:4000/addorderlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedOrder),
        });

        // Check if the response is OK
        if (response.ok) {
            alert('Order placed successfully!');
            // Optionally reset the form and clear cart state
            setOrder({
                customerName: "",
                address: "",
                city: "",
                pin: "",
                paymentMethod: "",
                quantity: 0,
                total: getTotalCartAmount(),
                products: []
            });
        } else {
            alert('Error placing order!');
        }
    };

    return (
        <div className='cartitems'>
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {/* Map through the cart items and display them */}
            {all_product.map((e) => {
                if (cartItems[e.id] > 0) {
                    return (
                        <div key={e.id}>
                            <div className='cartitems-format cartitems-format-main'>
                                <img className='carticon-product-icon' src={e.image} alt="" />
                                <p>{e.name}</p>
                                <p>${e.new_price}</p>
                                <button className='cartitems-quantity'>{cartItems[e.id]}</button>
                                <p>${e.new_price * cartItems[e.id]}</p>
                                <img src={remove_icon} onClick={() => { removeFromCart(e.id) }} className='cartitems-remove-icon' alt="" />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div>
                        <div className="cartitems-total-item">
                            <p>Subtotal</p>
                            <p>${getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <p>Shipping Fee</p>
                            <p>Free</p>
                        </div>
                        <hr />
                        <div className="cartitems-total-item">
                            <h3>Total</h3>
                            <h3>${getTotalCartAmount()}</h3>
                        </div>
                    </div>

                    {/* Place Order button */}
                    <button onClick={handlePlaceOrder}>PLACE ORDER</button>
                </div>

                <div className="cartitems-promocode">
                    <form className="place-order">
                        <div className="place-order-left">
                            <p className="title">Delivery Information</p>
                            <div className="multi-fields">
                                <input type="text" name="customerName" value={order.customerName} onChange={handleChange} placeholder='Name' />
                            </div>
                            <input type="text" name="address" value={order.address} onChange={handleChange} placeholder='Address' />
                            <div className="multi-fields">
                                <input type="text" name="city" value={order.city} onChange={handleChange} placeholder='City' />
                            </div>
                            <div className="multi-fields">
                                <input type="text" name="pin" value={order.pin} onChange={handleChange} placeholder='Pin Code' />
                            </div>
                            <div className="multi-fields">
                                <select name="paymentMethod" value={order.paymentMethod} onChange={handleChange}>
                                    <option value="UPI">UPI</option>
                                    <option value="Card">Debit/Credit Card</option>
                                    <option value="NetBanking">Net Banking</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CartItems;
