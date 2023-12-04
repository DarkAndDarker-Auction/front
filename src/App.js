import React, { useEffect, useState } from 'react'
import Signin from './components/signin/Signin'
import Auction from './components/auction/Auction'
import Signup from './components/signup/Signup'
import AuctionChat from './components/chat/AuctionChat'
import configureAxios from './components/common/config/AxiosConfig'
import Notification from './components/notification/Notification'
import styles from './App.module.css'
import './App.css'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import axios from 'axios'

const signout = async (cookies, resetTokens) => {
    try {
        await axios.post('http://localhost:8080/auth/signout', {
            accessToken: cookies.accessToken,
            refreshToken: cookies.refreshToken
        });
        return true;
    } catch (error) {
        console.error(error.response);
    }
}

export default function App() {
    const movePage = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(["accessToken", "refreshToken", "fcmToken"]);
    const [authorized, setAuthorized] = useState(false);

    const resetTokens = () => {
        removeCookies("accessToken", { path: "/" });
        removeCookies("refreshToken", { path: "/" });
        console.log("removeCookies");
    }

    const handleSignout = async () => {
        const isSuccess = await signout(cookies, resetTokens)
        if (isSuccess) {
            console.log("sign out success");
            resetTokens();
            movePage("/auction/search");
            window.location.reload();
            setAuthorized(false);
        }
    }

    const signinSuccess = () => {
        console.log("sign in success");
        movePage("/auction/search");
        window.location.reload();
        setAuthorized(true);
    }

    if (cookies.accessToken && cookies.refreshToken && !authorized) {
        setAuthorized(true);
    }

    configureAxios(cookies, movePage, setCookies, resetTokens);

    return (
        <div className={styles.background_wrapper}>
            <div className={styles.header}>
                <div className={styles.logo} onClick={() => movePage("/auction/search")}>
                    <img src="https://front.darkanddarker.com/dnd_name.webp" alt="" />
                </div>
                <div className={styles.user_feature_wrapper}>
                    {!authorized && <div className={styles.user_feature} onClick={() => movePage("/user/sign-in")}>Sign In</div>}
                    {authorized && <div className={styles.user_feature} onClick={handleSignout}>Sign Out</div>}
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.body__contents}>
                    <Routes>
                        <Route path={"/auction/*"} element={<Auction />}></Route>
                        <Route path={"/user/sign-in"} element={<Signin signinSuccess={signinSuccess} />}></Route>
                        <Route path={"/user/sign-up"} element={<Signup />}></Route>
                        <Route path={"/auction-chat"} element={<AuctionChat cookies={cookies} />}></Route>
                        <Route path={"/notification"} ></Route>
                    </Routes>
                </div>
                <div className={styles.floating_menu}>
                    {authorized ?
                        <Notification cookies={cookies} setCookies={setCookies} />
                        : null}
                    <Tooltip title="Auction Chat" placement='left'>
                        <Fab color="primary" aria-label="add" className={styles.chat_menu} onClick={() => movePage("/auction-chat")}>
                            <span className={styles.notify_new}>N</span>
                            <ChatIcon sx={{ height: "30px" }} />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
        </div >
    );
}