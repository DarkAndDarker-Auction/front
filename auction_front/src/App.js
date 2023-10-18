import React from 'react'
import Signin from './components/signin/Signin'
import Main from './components/main/Main'
import Signup from './components/signup/Signup'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {

    return (
        <div className="background-wrapper">

            <BrowserRouter>
                <Routes>
                    <Route path={"/main"} element={<Main />}></Route>
                    <Route path={"/user/sign-in"} element={<Signin />}></Route>
                    <Route path={"/user/sign-up"} element={<Signup />}></Route>
                </Routes>
            </BrowserRouter>

        </div>
    );
}