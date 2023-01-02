import {Routes, Route, useNavigate} from "react-router-dom"
import Login from "./login/Login"
import React, {useEffect, useState} from 'react';

import {Chat} from "./chat/Chat"
import Register from "./register/Register";
import Navbar from "./components/navbar/Navbar";
import {Profile} from "./profile/Profile";

function App() {
    const [token, setToken] = useState(null)

    useEffect(() => {
        const storageToken = localStorage.getItem('token')
        if(storageToken !== token) {
            setToken(storageToken)
        }
    })

    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={token === null ? <Login/> : <Chat/>}/>
                <Route path="/register" element={token === null ? <Register/> : <Chat/>}/>
                <Route path="/chat" element={<Chat/>}/>
                <Route path="/profile" element={<Profile/>}/>
            </Routes>
        </div>
    )
}

export default App