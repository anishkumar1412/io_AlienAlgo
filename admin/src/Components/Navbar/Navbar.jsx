import React from 'react';
import './Navbar.css';
import navlogo from '../../assets/Admin_Assets/new_logo.png';
import navProfile from '../../assets/Admin_Assets/nav-profile.svg';

function Navbar() {
    return (
        <div className='navbar'>
            <div className='img'>
                <img src={navlogo} alt="" className="nav-logo" />
                <p>WAREHOUSE</p>
            </div>
            {/* Changed P to p */}
            <img src={navProfile} className='nav-profile' alt="" />
        </div>
    );
}

export default Navbar;
