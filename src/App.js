import {Routes, Route, useNavigate} from "react-router-dom"
import Login from "./login/Login"
import React, {useEffect, useState} from 'react';

import {Chat} from "./chat/Chat"
import Register from "./register/Register";

function App() {
    const [token, setToken] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        const storageToken = localStorage.getItem('token')
        if(storageToken !== token) {
            setToken(storageToken)
        }
    })

    useEffect(() => {
        if (token) {
            navigate("/chat");
        }
    }, [token]);


    return (
        <div className="App">
            <Routes>
                <Route path="/" element={token === null ? <Login/> : <Chat/>}/>
                <Route path="/register" element={token === null ? <Register/> : <Chat/>}/>
                <Route path="/chat" element={<Chat/>}/>
            </Routes>
        </div>
    )
}

export default App