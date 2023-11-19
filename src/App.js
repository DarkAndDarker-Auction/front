import React, { useEffect, useState } from 'react'
import Signin from './components/signin/Signin'
import Auction from './components/auction/Auction'
import Signup from './components/signup/Signup'
import AuctionChat from './components/chat/AuctionChat'
import styles from './App.module.css'
import './App.css'
import './messaging_init_in_sw'
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'
import Tooltip from '@mui/material/Tooltip';
import Fab from '@mui/material/Fab';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import axios from 'axios'
// import Notification from './components/notification/Notification'
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBH-VuvbpTnysAmXM-nNlhc6omvMaOMkug",
    authDomain: "auctionnotification-47f61.firebaseapp.com",
    projectId: "auctionnotification-47f61",
    storageBucket: "auctionnotification-47f61.appspot.com",
    messagingSenderId: "210811415060",
    appId: "1:210811415060:web:bd0b8db7e42b805db11501",
    measurementId: "G-T8HC8SSD3G"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

console.log(messaging);
onMessage(messaging, (payload) => {
    console.log("message received", payload);
})

export const requestPermission = () => {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
            console.log("Notification permission granted.");

            getToken(messaging, {
                vapidKey:
                    "BHWYeR5CjxADH-QQ-yFFgPM39Quz583R43AWZaZs6kYrnGhDe3qggi8y6qQiAhU4Psarnrp3-mZrvVmWrvU_cMA",
            }).then((currentToken) => {
                if (currentToken) {
                    console.log("currentToken: ", currentToken);
                } else {
                    console.log("Can not get token");
                }
            });
        } else {
            console.log("Do not have permission!");
        }
    });
}

requestPermission();

export default function App() {
    const REFRESH_TOKEN_EXPIRATION_DAY = 7;

    const movePage = useNavigate();
    const [cookies, setCookies, removeCookies] = useCookies(["accessToken", "refreshToken"]);
    const [authorized, setAuthorized] = useState(false);

    axios.defaults.baseURL = 'http://localhost:8080';
    axios.defaults.withCredentials = false;
    axios.interceptors.request.use(
        async (config) => {
            const accessToken = cookies.accessToken;
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            console.log(error.message);
            return Promise.reject(error);
        }
    );

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {

            const originalRequest = error.config;

            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (!cookies.accessToken || !cookies.refreshToken) {
                    // 토큰 정보가 없을 경우 -> signin 페이지로 이동
                    movePage("user/sign-in");
                    return Promise.reject(error);
                }

                try {
                    console.log("reissue");
                    const { data } = await axios.post('/auth/reissue', {
                        accessToken: cookies.accessToken,
                        refreshToken: cookies.refreshToken
                    });

                    const refreshTokenExpires = new Date();
                    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + REFRESH_TOKEN_EXPIRATION_DAY); // 7일

                    setCookies("accessToken", data.accessToken, { path: "/", expires: refreshTokenExpires });
                    setCookies("refreshToken", data.refreshTokxen, { path: "/", expires: refreshTokenExpires });

                    return axios(originalRequest);
                } catch (error) {
                    // 토큰 재발급 실패(토큰 정보 이상) -> 토큰 정보 초기화 -> signin페이지로 이동
                    resetTokens();
                    movePage("user/sign-in");
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        if (cookies.accessToken && cookies.refreshToken && !authorized) {
            setAuthorized(true);
        }
    });

    const resetTokens = () => {
        // Token 정보 삭제 및 초기화
        removeCookies("accessToken", { path: "/" });
        removeCookies("refreshToken", { path: "/" });
        setAuthorized(false);
    }

    const signout = async () => {
        try {
            await axios.post('http://localhost:8080/auth/signout', {
                accessToken: cookies.accessToken,
                refreshToken: cookies.refreshToken
            });
        } catch (error) {
            console.error(error.response);
        }
    }

    const signinSuccess = () => {
        setAuthorized(true);
    }

    const handleLogo = () => {
        movePage("/auction/search");
    }
    const handleSignin = () => {
        movePage("/user/sign-in");
    }

    const handleSignout = () => {
        signout();
    }

    const handleAuctionChat = () => {
        movePage("/auction-chat");
    }

    return (
        <div className={styles.background_wrapper}>
            <div className={styles.header}>
                <div className={styles.logo} onClick={handleLogo}>
                    <img src="https://front.darkanddarker.com/dnd_name.webp" alt="" />
                </div>
                <div className={styles.user_feature_wrapper}>
                    {!authorized && <div className={styles.user_feature} onClick={handleSignin}>Sign In</div>}
                    {authorized && <div className={styles.user_feature} onClick={handleSignout}>Sign Out</div>}
                </div>
            </div>
            <div className={styles.body}>
                <div className={styles.body__contents}>
                    <Routes>
                        <Route path={"/auction/*"} element={<Auction />}></Route>
                        <Route path={"/user/sign-in"} element={<Signin signinSuccess={signinSuccess} />}></Route>
                        <Route path={"/user/sign-up"} element={<Signup />}></Route>
                        <Route path={"/auction-chat"} element={<AuctionChat />}></Route>
                        <Route path={"/notification"} ></Route>
                    </Routes>
                </div>
                <div className={styles.floating_menu}>
                    <Tooltip title="Notification" placement='left' >
                        <Fab color="primary" aria-label="add" className={styles.noti_menu}>
                            <span className={styles.notify_new}>N</span>
                            <NotificationsActiveIcon sx={{ height: "30px" }} />
                        </Fab>
                    </Tooltip>
                    <Tooltip title="Auction Chat" placement='left'>
                        <Fab color="primary" aria-label="add" className={styles.chat_menu} onClick={handleAuctionChat}>
                            <span className={styles.notify_new}>N</span>
                            <ChatIcon sx={{ height: "30px" }} />
                        </Fab>
                    </Tooltip>
                </div>
            </div>
        </div >
    );
}