import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { validateEmail, removeWhitespace } from '../common/util'
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'
import './InputValidation.css'

const signup = async (email, password, username) => {
    try {
        const res = await axios.post('http://localhost:8080/auth/signup', {
            email: email,
            password: password,
            username: username,
        }, {
            withCredentials: false,
        });

        // // accessToken, refreshToken 로컬스토리지 저장.
        // const { accessToken, refreshToken } = res.data;
        // localStorage.setItem('accessToken', accessToken);
        // localStorage.setItem('refreshToken', refreshToken);

        return true;

    } catch (error) {
        console.error(error.response);
        return false;

    }
}

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isPasswordMatched, setIsPasswordMatched] = useState(true);
    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);

    const movePage = useNavigate();

    useEffect(() => {
        setIsDisabled(!(email && isValidateEmail && password && repeatPassword && isPasswordMatched && username));
    }, [email, password, repeatPassword, username])

    const onChangeEmail = (event) => {
        const curEmail = removeWhitespace(event.target.value);
        setEmail(curEmail);
    };

    const onChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const onChangeRepeatPassword = (event) => {
        setRepeatPassword(event.target.value);
    };

    const onChangeUsername = (event) => {
        setUsername(event.target.value);
    };

    // 포커스 벗어났을 떄 repeatPassword password 비교
    const onBlurRepeatPassword = () => {
        if (password === repeatPassword) {
            setIsPasswordMatched(true);
            return;
        }
        setIsPasswordMatched(false);
    }

    // 포커스 벗어났을 떄 repeatPassword password 비교
    const onBlurEmail = () => {
        setIsValidateEmail(validateEmail(email));
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccess = await signup(email, password, username);
        if (isSuccess) {
            movePage('/main');
        }
    }

    return (
        <div className={styles.signup_container} >
            <img src="https://www.darkndarker.fr/wp-content/uploads/2023/01/dark_and_darker_h1-1024x158.png" alt="" />

            <div className={styles.input_container}>
                <label htmlFor="email">Email</label>
                <input type="text" onChange={onChangeEmail} onBlur={onBlurEmail}
                    name="email" id={`input_value_${isValidateEmail ? "correct" : "incorrect"}`} />
                {!isValidateEmail && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>올바른 이메일 형식이 아닙니다.</div>}

            </div>
            <div className={styles.input_container}>
                <label htmlFor="password">Password</label>
                <input type="password" onChange={onChangePassword} name="password" />
            </div>
            <div className={styles.input_container}>
                <label htmlFor="repeatPassword">Repeat Password</label>
                <input type="password" onChange={onChangeRepeatPassword} onBlur={onBlurRepeatPassword}
                    name="repeatPassword" id={`input_value_${isPasswordMatched ? "correct" : "incorrect"}`} />
                {!isPasswordMatched && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>일치하지 않는 비밀번호 입니다.</div>}
            </div>
            <div className={styles.input_container}>
                <label htmlFor="username">Username</label>
                <input type="text" onChange={onChangeUsername} name="username" />
            </div>
            <div className={styles.input_container}>
                <button type="submit" onClick={handleSubmit} disabled={isDisabled}>SIGN UP</button>
            </div >
        </div >
    );
}

export default Signup