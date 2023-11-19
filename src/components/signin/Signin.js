import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import styles from './Signin.module.css';

const Signin = ({ signinSuccess }) => {

    const REFRESH_TOKEN_EXPIRATION_DAY = 7;

    const movePage = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authenticationFailed, setAuthenticationFailed] = useState(false);
    const [, setCookie,] = useCookies(["accessToken", "refreshToken"]);

    const signin = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:8080/auth/signin', {
                email: email,
                password: password
            });

            const refreshTokenExpires = new Date();
            refreshTokenExpires.setDate(refreshTokenExpires.getDate() + REFRESH_TOKEN_EXPIRATION_DAY); // 7일

            setCookie("accessToken", data.accessToken, { path: "/", expires: refreshTokenExpires });
            setCookie("refreshToken", data.refreshToken, { path: "/", expires: refreshTokenExpires });

            return true;

        } catch (error) {
            console.error(error.response);
            return false;
        }
    }

    const handleSignin = async (event) => {
        event.preventDefault();
        const res = await signin(email, password);

        if (res) {
            window.location.reload();
            movePage(-1);
            signinSuccess();
            return;
        }

        setAuthenticationFailed(true);
        const inputEmail = document.querySelector('.input_email');
        const inputPassword = document.querySelector('.input_password');
        inputEmail.style.borderBottom = "1px solid red";
        inputPassword.style.borderBottom = "1px solid red";
        inputPassword.value = "";
        setPassword(null);
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
        <div className={styles.signin_background_wrapper}>
            <div className={styles.signin_container}>
                <img src="https://www.darkndarker.fr/wp-content/uploads/2023/01/dark_and_darker_h1-1024x158.png" alt="" />
                <div className={styles.input_wrapper}>
                    <input type="text" className='input_email' value={email} onChange={onChangeEmail} placeholder='email' />
                </div>
                <div className={styles.input_wrapper}>
                    <input type="password" className='input_password' value={password} onChange={onChangePassword} placeholder='password' />
                    {authenticationFailed && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>로그인에 실패하였습니다.</div>}
                </div>
                <div className={styles.btn_wrapper}>
                    <button type="submit" onClick={handleSignin}>SIGN IN</button>
                </div>
                <div className="line"></div>
                <div className={styles.signup_notice}>
                    have no account?
                    <div href="" className="signup" onClick={onClickSignup}> Sign Up </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;