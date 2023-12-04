import axios from 'axios';

export const configureAxios = (cookies, movePage, setCookies, resetTokens) => {

    const REFRESH_TOKEN_EXPIRATION_DAY = 7; // 리프레시 토큰 만료일 (7 일)

    axios.interceptors.request.use(
        async (config) => {
            const accessToken = cookies.accessToken;
            console.log(cookies.accessToken);
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
                    movePage("user/sign-in");
                    return Promise.reject(error);
                }

                try {
                    console.log("재발급");
                    const { data } = await axios.post('/auth/reissue', {
                        accessToken: cookies.accessToken,
                        refreshToken: cookies.refreshToken
                    });

                    const refreshTokenExpires = new Date();
                    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + REFRESH_TOKEN_EXPIRATION_DAY); // 7일

                    setCookies("accessToken", data.accessToken, { path: "/", expires: refreshTokenExpires });
                    setCookies("refreshToken", data.refreshToken, { path: "/", expires: refreshTokenExpires });
                    window.location.reload();

                    return axios(originalRequest);
                } catch (error) {
                    resetTokens();
                    movePage("user/sign-in");
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );
};

export default configureAxios;
