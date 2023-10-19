import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { validateEmail, removeWhitespace } from '../common/util'
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'
import './InputValidation.css'

const signup = async (email, password, nickname) => {
    try {
        const res = await axios.post('http://localhost:8080/auth/signup', {
            email: email,
            password: password,
            nickname: nickname,
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

const sendEmailVerificationCode = async (email) => {
    try {
        const res = await axios.post('http://localhost:8080/auth/email-verification/send', {
            email: email,
        }, {
            withCredentials: false,
        });
        if (res.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.response);
        return false;
    }
}


const verifyEmailVerificationCode = async (email, verificationCode) => {
    try {
        const res = await axios.post('http://localhost:8080/auth/email-verification/verify', {
            email: email,
            code: verificationCode,
        }, {
            withCredentials: false,
        });
        if (res.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.error(error.response);
        return false;
    }
}

const verifyNicknameVerification = async (nickname) => {
    try {
        const res = await axios.post('http://localhost:8080/member/verification/nickname', {
            nickname: nickname,
        }, {
            withCredentials: false,
        });
        if (res.status === 200) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error.response)
    }
}

const Signup = () => {

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [nickname, setNickname] = useState('');

    const [isPasswordMatched, setIsPasswordMatched] = useState(true);
    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [isVerificationCodeValidate, setIsVerificationCodeValidate] = useState(true);
    const [isNicknameValidate, setIsNicknameValidate] = useState(true);
    const [isDisabled, setIsDisabled] = useState(true);

    const movePage = useNavigate();

    useEffect(() => {
        setIsDisabled(!(email && isValidateEmail && isVerificationCodeValidate && isNicknameValidate
            && password && repeatPassword && isPasswordMatched && nickname));
    }, [email, verificationCode, password, repeatPassword, nickname])

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

    const onChangeNickname = (event) => {
        setNickname(event.target.value);
    };

    const onChangeVerificationCode = (event) => {
        setVerificationCode(event.target.value);
    }

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

    const handleSendEmailVerificationCode = async (event) => {
        const isValidate = await sendEmailVerificationCode(email);
        setIsVerificationCodeValidate(isValidate);
        console.log(isValidate);
    }

    const handleVerifyEmailVerificationCode = async (event) => {
        const isValidate = await verifyEmailVerificationCode(email, verificationCode);
        setIsVerificationCodeValidate(isValidate);
        console.log(isVerificationCodeValidate);
    }

    const handleNicknameVerification = async (event) => {
        const isValidate = await verifyNicknameVerification(nickname);
        setIsNicknameValidate(isValidate);
        console.log(isValidate);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccess = await signup(email, password, nickname);
        if (isSuccess) {
            movePage('/main');
            return;
        }
        console.log("입력되지 않은 정보가 있습니다.");
    }

    return (
        <div className={styles.signup_container} >
            <img src="https://www.darkndarker.fr/wp-content/uploads/2023/01/dark_and_darker_h1-1024x158.png" alt="" />
            <div className={styles.input_container}>
                <label htmlFor="email">Email</label>
                <div className={styles.input_wrapper}>
                    <input type="text" onChange={onChangeEmail} onBlur={onBlurEmail}
                        name="email" className={`input_value_${isValidateEmail ? "correct" : "incorrect"}`} />
                    {!isValidateEmail && <div className={styles.input_validation_incorrect}>올바른 이메일 형식이 아닙니다.</div>}
                    <button className={`${styles.button} ${styles.send_email}`} onClick={handleSendEmailVerificationCode}>SEND</button>
                </div>
            </div>

            <div className={styles.input_container}>
                <label htmlFor="password">Verification Code</label>
                <div className={styles.input_wrapper}>
                    <input type="text" onChange={onChangeVerificationCode} name="verificationCode" />
                    {!isVerificationCodeValidate && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>인증번호를 확인해주세요.</div>}
                    <button className={`${styles.button} ${styles.verify_code}`} onClick={handleVerifyEmailVerificationCode}>VERIFY</button>
                </div>
            </div>

            <div className={styles.input_container}>
                <label htmlFor="password">Password</label>
                <input type="password" onChange={onChangePassword} name="password" />
            </div>

            <div className={styles.input_container}>
                <label htmlFor="repeatPassword">Repeat Password</label>
                <input type="password" onChange={onChangeRepeatPassword} onBlur={onBlurRepeatPassword} name="repeatPassword" />
                {!isPasswordMatched && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>일치하지 않는 비밀번호 입니다.</div>}
            </div>

            <div className={styles.input_container}>
                <label htmlFor="nickname">Nickname</label>
                <div className={styles.input_wrapper}>
                    <input type="text" onChange={onChangeNickname} name="nickname" />
                    {!isNicknameValidate && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>사용할 수 없는 닉네임 입니다.</div>}
                    <button className={`${styles.button} ${styles.verfiy_nickname}`} onClick={handleNicknameVerification}>VERIFY</button>
                </div>
            </div>

            <div className={styles.input_container}>
                <button className={styles.submit_button} type="submit" onClick={handleSubmit} disabled={isDisabled}>SIGN UP</button>
            </div >
        </div >
    );
}

export default Signup