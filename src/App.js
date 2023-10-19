import React from 'react'
import Signin from './components/signin/Signin'
import Auction from './components/auction/Auction'
import Signup from './components/signup/Signup'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {

    return (
        <div className="background-wrapper">

            <BrowserRouter>
                <Routes>
                    <Route path={"/auction"} element={<Auction />}></Route>
                    <Route path={"/user/sign-in"} element={<Signin />}></Route>
                    <Route path={"/user/sign-up"} element={<Signup />}></Route>
                </Routes>
            </BrowserRouter>

        </div>
    );
}