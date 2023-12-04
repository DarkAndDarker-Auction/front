import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import store from './store'
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import reportWebVitals from './reportWebVitals';
import App from './App'
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';

const root = ReactDOM.createRoot(document.getElementById('root'));
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = false;

root.render(
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
