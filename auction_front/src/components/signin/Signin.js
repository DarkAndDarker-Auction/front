import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './Signin.module.css';

const signin = async (email, password) => {

    try {
        const res = await axios.post('http://localhost:8080/auth/signin', {
            email: email,
            password: password
        }, {
            withCredentials: false,
        });
        console.log(res.data);
        const { accessToken, refreshToken } = res.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        return true

    } catch (error) {
        console.error(error.response);
        return false;
    }
}


const Signin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const movePage = useNavigate();
    let res = false;

    const searchKeyRedux = useSelector((state) => state.searchKey);
    console.log("searchKey : " + searchKeyRedux);

    const handleSubmit = async (event) => {
        event.preventDefault();
        res = await signin(email, password);
        if (res) {
            movePage("/main");
        }
    }

    const onChangeEmail = (event) => {
        setEmail(event.target.value);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const onClickSignup = (event) => {
        event.preventDefault();
        movePage("/user/sign-up");
    }

    return (
        <div className={styles.signin_container}>
            <img src="https://www.darkndarker.fr/wp-content/uploads/2023/01/dark_and_darker_h1-1024x158.png" alt="" />
            <form onSubmit={handleSubmit}>
                <div className={styles.input_container}>
                    <input type="text" value={email} onChange={onChangeEmail} placeholder='email' />
                </div>
                <div className={styles.input_container}>

                    <input type="password" value={password} onChange={onChangePassword} placeholder='password' />
                </div>
                <div className={styles.input_container}>
                    <button type="submit">SIGN IN</button>
                </div>
                <div className="line"></div>
                <div className={styles.signup_notice}>
                    have no account?
                    <a href="" className="signup" onClick={onClickSignup}> Sign Up </a>
                </div>
            </form>
        </div>

    );
}

export default Signin;