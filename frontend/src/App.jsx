import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Shop from './Components/Pages/Shop'
import ShopCategory from './Components/Pages/ShopCategory'
import Product from './Components/Pages/Product'
import LoginSignUp from './Components/Pages/LoginSignUp'
import Cart from './Components/Pages/Cart'
import Footer from './Components/Footer/Footer'
import new_banner1 from './assets/Frontend_Assets/new_banner1.png'
import new_banner2 from './assets/Frontend_Assets/new_banner2.png'
import Health_beauty from './assets/Frontend_Assets/Health_beauty.png'
import Orderuser from './Components/OrderUser/Orderuser'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Shop />} ></Route>
          <Route path='/mens' element={<ShopCategory category="groceries" banner={new_banner1} />}  ></Route>
          <Route path='/womens' element={<ShopCategory category="electronics" banner={new_banner2} />} ></Route>
          <Route path='/kids' element={<ShopCategory category="health and beauty" banner={Health_beauty} />}  ></Route>
          <Route path='/myorders' element={<Orderuser/>}  ></Route>

          <Route path='/product' element={<Product />} >
            <Route path=':productId' element={<Product />}></Route>
          </Route>
          <Route path='/cart' element={<Cart />} ></Route>
          <Route path='/login' element={<LoginSignUp />} ></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}

export default App
