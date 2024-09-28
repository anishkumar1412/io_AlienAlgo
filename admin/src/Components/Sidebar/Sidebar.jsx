import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import add_product_icon from '../../assets/Admin_Assets/Product_Cart.svg'
import list_product_icon from '../../assets/Admin_Assets/Product_list_icon.svg'
import orderlist from '../../assets/Admin_Assets/orderlist.svg'
import invoice from '../../assets/Admin_Assets/invoice.png'
import navigation from '../../assets/Admin_Assets/navigation.svg'
import dashboard from '../../assets/Admin_Assets/dashboard.png'

function Sidebar() {
    return (
        <div className='sidebar'>
            <Link to={'/dashboard'} style={{ textDecoration: "none" }} >
                <div className="sidebar-item">
                    <img src={dashboard} alt="" />
                    <p>Dashboard</p>
                </div>
            </Link>
            <Link to={'/addproduct'} style={{ textDecoration: "none" }} >
                <div className="sidebar-item">
                    <img src={add_product_icon} alt="" />
                    <p>Add Product</p>
                </div>
            </Link>
            <Link to={'/listproduct'} style={{ textDecoration: "none" }} >
                <div className="sidebar-item">
                    <img src={list_product_icon} alt="" />
                    <p>Product List</p>
                </div>
            </Link>
            <Link to={'/orderlist'} style={{ textDecoration: "none" }} >
                <div className="sidebar-item">
                    <img src={orderlist} alt="" />
                    <p>Order List</p>
                </div>
            </Link>
            <Link to={'/invoice'} style={{ textDecoration: "none" }} >
                <div className="sidebar-item">
                    <img src={invoice} alt="" />
                    <p>Invoice Generator</p>
                </div>
            </Link>
            <Link to={'/navigation'} style={{ textDecoration: "none" }} >
                <div className="sidebar-item">
                    <img class="svg" src={navigation} alt="" />
                    <p>Navigation</p>
                    
                </div>
            </Link>
        </div>
    )
}

export default Sidebar
