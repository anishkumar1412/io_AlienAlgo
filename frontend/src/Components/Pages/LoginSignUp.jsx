import React from 'react'
import './CSS/LoginSignup.css'
import { useState } from 'react'

function LoginSignUp() {

    const [state, setState] = useState("Sign Up");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const changHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const signUp = async () => {
        console.log("signup function executed", formData)
        let responseData;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData = data)

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token)
            window.location.replace('/');
        } else {
            alert(responseData.errors)
        }
    }
    const login = async () => {
        console.log("login function executed", formData)
        let responseData;
        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/form-data',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData = data)

        if (responseData.success) {
            localStorage.setItem('auth-token', responseData.token)
            window.location.replace('/');
        } else {
            alert(responseData.errors)
        }

    }

    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {
                        state === "Sign Up" ? <input type="text" placeholder='Your Name' name='username' value={formData.username} onChange={changHandler} /> : <></>
                    }
                    <input name='email' value={formData.email} type="email" placeholder='Email Address' onChange={changHandler} />
                    <input name='password' value={formData.password} type="password" placeholder='Password' onChange={changHandler} />
                </div>
                <button onClick={() => {
                    state === "Login" ? login() : signUp()
                }} >Continue</button>
                {
                    state === "Login" ? <p className='loginsignup-login' >Create an Account <span onClick={() => setState("Sign Up")} >Click here</span> </p> :
                        <p className='loginsignup-login' >Already have an account? <span onClick={() => setState("Login")} >Login here</span> </p>
                }


                <div className="loginsignup-agree">
                    <input type="checkbox" />
                    <p>By continuing , I agree to the terms and condition & privacy policy</p>
                </div>
            </div>

        </div>
    )
}

export default LoginSignUp
