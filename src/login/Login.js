import React, {Component} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import "./login.css";
import axios from "axios";

function Login() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const {uname, pass} = document.forms[0];

        axios.post(`${process.env.REACT_APP_SERVER_URL}/login`, {
            username: uname.value,
            password: pass.value,
        }).then((response) => {
            localStorage.setItem("token", response.data.token);
            navigate("/chat");
        })
    };

    return (
        <div className="login-form">
            <div className="title">Login</div>
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>Username </label>
                        <input type="text" name="uname" required/>
                    </div>
                    <div className="input-container">
                        <label>Password </label>
                        <input type="password" name="pass" required/>
                    </div>
                    <div className="button-container">
                        <input type="submit"/>
                    </div>
                    <hr/>
                    <div className="button-container">
                        <Link to={'/register'}>
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;