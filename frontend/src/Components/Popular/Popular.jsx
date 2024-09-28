import React, { useEffect } from 'react'
import './Popular.css'
// import data_product from '../../assets/Frontend_Assets/data'
import Item from '../Item/Item'
import { useState } from 'react'

function Popular() {

    const [data_product, setData_product] = useState([])

    useEffect(() => {
        fetch('http://localhost:4000/popularinwomen').then((response) => response.json()).then((data) => setData_product(data))
    }, [])

    return (
        <div className='popular'>
            <h1> POPULAR PRODUCTS </h1>
            <hr />
            <div className="popular-item">
                {data_product.map((item, i) => {
                    return <Item key={i} id={item.id} name={item.name} image={item.image} new_price={item.new_price} old_price={item.old_price} />
                })}
            </div>
        </div>
    )
}

export default Popular
