import React, { useState } from 'react';
import './AddProduct.css';
import upload_area from '../../assets/Admin_Assets/upload_area.svg';

function AddProduct() {
    const [image, setImage] = useState(null);
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "electronics",
        new_price: "",
        old_price: "",
        quantity: "",
        cost: ""
    });

    const changeHandler = (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const imageHandler = (e) => {
        setImage(e.target.files[0]);
    };

    const addProduct = async () => {
        let responseData;
        const formData = new FormData();

        formData.append('product', image);

        // Upload image to Cloudinary
        await fetch('http://localhost:4000/upload', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: formData,
        })
            .then((resp) => resp.json())
            .then((data) => { responseData = data });

        if (responseData.success) {
            const product = {
                ...productDetails,
                image: responseData.image_url,
            };

            // Add product details to the database
            await fetch('http://localhost:4000/addproduct', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            })
                .then((resp) => resp.json())
                .then((data) => {
                    data.success ? alert("Product Added") : alert('Failed to add product');
                });
        } else {
            alert('Failed to upload image');
        }
    };

    return (
        <div className='add-product'>
            <div className="addproduct-itemfield">
                <p>Product title</p>
                <input value={productDetails.name} onChange={changeHandler} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input value={productDetails.old_price} onChange={changeHandler} type="text" name='old_price' placeholder='Type here' />
                </div>
                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input value={productDetails.new_price} onChange={changeHandler} type="text" name='new_price' placeholder='Type here' />
                </div>
            </div>
            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select value={productDetails.category} onChange={changeHandler} name="category" className='add-product-selector'>
                    <option value="electronics">electronics</option>
                    <option value="groceries">groceries</option>
                    <option value="health and beauty">health and beauty</option>
                </select>
                <div style={{

                }}>
                    <p>Quantity</p>
                    <input className='quantity-input' value={productDetails.quantity} onChange={changeHandler} type="number" name='quantity' placeholder='Enter the quantity' />
                    <p>Cost</p>
                    <input className='quantity-input' value={productDetails.cost} onChange={changeHandler} type="number" name='cost' placeholder='Enter the cost' />

                </div>
            </div>
            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img src={image ? URL.createObjectURL(image) : upload_area} alt="" className='addproduct-thumbnail-img' />
                </label>
                <input onChange={imageHandler} type="file" name='image' id='file-input' hidden />
            </div>
            <button className='addproduct-btn' onClick={addProduct}>Add</button>
        </div>
    );
}

export default AddProduct;
