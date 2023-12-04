import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { validateEmail, removeWhitespace } from '../common/utils/Utils'
import { useNavigate } from 'react-router-dom';
import styles from './Signup.module.css'
import './InputValidation.css'
import { formatTime } from '../common/utils/Utils';

const signup = async (email, password, nickname) => {
    try {
        await axios.post('http://localhost:8080/auth/signup', {
            email: email,
            password: password,
            nickname: nickname,
        });

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
    const movePage = useNavigate();

    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [nicknameValidationMessage, setNicknameValidationMessage] = useState('닉네임 중복 확인을 해주세요.');

    const [isPasswordMatched, setIsPasswordMatched] = useState(false);
    const [isValidateEmail, setIsValidateEmail] = useState(true);
    const [isVerificationCodeValidate, setIsVerificationCodeValidate] = useState(false);
    const [isNicknameValidate, setIsNicknameValidate] = useState(false);
    const [isEmailSend, setIsEmailSend] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const [timer, setTimer] = useState(300);

    useEffect(() => {
        setIsDisabled(!(isValidateEmail && isVerificationCodeValidate && isNicknameValidate && isPasswordMatched));
    }, [isValidateEmail, isVerificationCodeValidate, isNicknameValidate, isPasswordMatched])

    useEffect(() => {
        let countdownInterval;

        if (isEmailSend) {
            countdownInterval = setInterval(() => {
                if (timer > 0) {
                    setTimer(timer - 1);
                }
            }, 1000);
        } else {
            clearInterval(countdownInterval);
        }

        return () => clearInterval(countdownInterval);
    }, [isEmailSend, timer]);

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
        setIsNicknameValidate(false);
        setNicknameValidationMessage("닉네임 중복 확인을 해주세요.")
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
        console.log("blur");
        setIsValidateEmail(validateEmail(email));
    }

    const handleSendEmailVerificationCode = async () => {
        if (!isValidateEmail) return;
        sendEmailVerificationCode(email);
        setIsEmailSend(true);
    }

    const handleVerifyEmailVerificationCode = async () => {
        const isValidate = await verifyEmailVerificationCode(email, verificationCode);
        setIsVerificationCodeValidate(isValidate);
        if (isValidate) {
            const inputEmail = document.querySelector('.email');
            const inputVerificationCode = document.querySelector('.verification_code');
            inputVerificationCode.readOnly = true;
            inputEmail.readOnly = true;
        }
    }

    const handleNicknameVerification = async () => {
        const isValidate = await verifyNicknameVerification(nickname);
        setIsNicknameValidate(isValidate);
        if (isValidate) {
            return;
        }
        setNicknameValidationMessage("이미 사용중인 닉네임 입니다.")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const isSuccess = await signup(email, password, nickname);
        if (isSuccess) {
            movePage('/user/sign-in');
            return;
        }
        console.log("입력되지 않은 정보가 있습니다.");
    }

    return (
        <div className={styles.signup_background_wrapper}>
            <div className={styles.signup_container} >
                <img src="https://www.darkndarker.fr/wp-content/uploads/2023/01/dark_and_darker_h1-1024x158.png" alt="" />
                <div className={styles.input_container}>
                    <label htmlFor="email">Email</label>
                    <div className={styles.input_wrapper}>
                        <input type="text" onChange={onChangeEmail} onBlur={onBlurEmail}
                            name="email" className={`input_value_${isValidateEmail ? "correct" : "incorrect"} email`} />
                        {!isValidateEmail && <div className={styles.input_validation_incorrect}>올바른 이메일 형식이 아닙니다.</div>}
                        {isEmailSend && <div className={styles.input_validation_correct}>이메일 인증코드를 확인해주세요.</div>}
                        <button className={`${styles.button} ${styles.send_email}`} onClick={handleSendEmailVerificationCode}>SEND</button>
                    </div>
                </div>

                <div className={styles.input_container}>
                    <label htmlFor="verificationCode">Verification Code</label>
                    <div className={styles.input_wrapper}>
                        <input type="text" onChange={onChangeVerificationCode} name="verificationCode" className="verification_code" />
                        {!isVerificationCodeValidate && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>인증번호를 확인해주세요.</div>}
                        {isVerificationCodeValidate && <div className={`${styles.input_container} ${styles.input_validation_correct}`}>인증에 성공하였습니다.</div>}
                        {isEmailSend && !isVerificationCodeValidate && <div className={`${styles.input_container} ${styles.verification_remain_time}`}>남은 시간 {formatTime(timer)}</div>}
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
                    {!isPasswordMatched && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>비밀번호를 확인해주세요.</div>}
                    {isPasswordMatched && <div className={`${styles.input_container} ${styles.input_validation_correct}`}>일치하는 비밀번호 입니다.</div>}
                </div>

                <div className={styles.input_container}>
                    <label htmlFor="nickname">Nickname</label>
                    <div className={styles.input_wrapper}>
                        <input type="text" onChange={onChangeNickname} name="nickname" className="nickname" />
                        {!isNicknameValidate && <div className={`${styles.input_container} ${styles.input_validation_incorrect}`}>{nicknameValidationMessage}</div>}
                        {isNicknameValidate && <div className={`${styles.input_container} ${styles.input_validation_correct}`}>사용 가능한 닉네임 입니다.</div>}
                        <button className={`${styles.button} ${styles.verfiy_nickname}`} onClick={handleNicknameVerification}>VERIFY</button>
                    </div>
                </div>

                <div className={styles.input_container}>
                    <button className={styles.submit_button} type="submit" onClick={handleSubmit} disabled={isDisabled}>SIGN UP</button>
                </div >
            </div >
        </div>
    );
}

export default Signup