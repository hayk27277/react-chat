import React, {Component} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import "./register.css";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        const {user_name, full_name, password, password_confirmation, email} = document.forms[0];

        if (password.value !== password_confirmation.value) {
            alert("Password confirmation does`t match.")
            return;
        }

        axios.post(`${process.env.REACT_APP_SERVER_URL}/register`, {
            username: user_name.value,
            password: password.value,
            name: full_name.value,
            email: email.value,
        }).then((response) => {
            localStorage.setItem("token", response.data.token);
            navigate("/chat");
        })
    };

    return (
        <div className="login-form">
            <div className="title">Register</div>
            <div className="form">
                <form onSubmit={handleSubmit}>
                    <div className="input-container">
                        <label>Full name</label>
                        <input type="text" name="full_name" required/>
                    </div>

                    <div className="input-container">
                        <label>User chat name</label>
                        <input type="text" name="user_name" required/>
                    </div>

                    <div className="input-container">
                        <label>User Email</label>
                        <input type="text" name="email" required/>
                    </div>

                    <div className="input-container">
                        <label>Password </label>
                        <input type="password" name="password" required/>
                    </div>

                    <div className="input-container">
                        <label>Confirm password</label>
                        <input type="password" name="password_confirmation" required/>
                    </div>

                    <div className="button-container">
                        <input type="submit" value={"Register"}/>
                    </div>

                    <hr/>
                    <div className="button-container">
                        <Link to={'/'}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;