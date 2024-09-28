import React from 'react'
import './Footer.css'
import footer_logo from '../../assets/Frontend_Assets/new_logo.png'
import instagram_icon from '../../assets/Frontend_Assets/instagram_icon.png'
import pintester_icon from '../../assets/Frontend_Assets/pintester_icon.png'
import whatapp_icon from '../../assets/Frontend_Assets/whatsapp_icon.png'



function Footer() {
    return (
        <div className='footer' >
            <div className="footer-logo">
                <img src={footer_logo} alt="" />
                <p>WAREHOUSE</p>
            </div>
            <ul className='footer-links'>
                <li>Company</li>
                <li>Products</li>
                <li>Offices</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
            <div className="footer-social-icon">
                <div className="footer-icons-container">
                    <img src={instagram_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={pintester_icon} alt="" />
                </div>
                <div className="footer-icons-container">
                    <img src={whatapp_icon} alt="" />
                </div>
            </div>
            <div className="footer-copyright">
                <hr />
                <p>Copyright @ 2024 - All right reserved</p>
            </div>
        </div>
    )
}

export default Footer
