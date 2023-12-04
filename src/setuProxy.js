import { createProxyMiddleware } from "http-proxy-middleware";

export default (app) => {
    app.use(
        "/ws",
        createProxyMiddleware({ target: "http://localhost:8080", ws: true })
    );
};