import React from 'react'
import Hero from '../Hero/Hero'
import Popular from '../Popular/Popular'
import Offers from '../Offers/Offers'
import NewCollection from '../../NewCollection/NewCollection'
import NewsLetter from '../../NewsLetter/NewsLetter'

function Shop() {
    return (
        <div>
            <Hero />
            <Popular />
            <Offers />
            <NewCollection />
            <NewsLetter />
        </div>
    )
}

export default Shop
