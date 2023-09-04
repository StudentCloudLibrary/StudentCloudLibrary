import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import {configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import { applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './_reducers';
// redux와 관련된 것들을 import

import 'antd/dist/antd';

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(configureStore);
// store를 만들 때 redux-promise와 redux-thunk를 사용하도록 만듬.
// applyMiddleware가 함수를 반환함. 

const container = document.getElementById('root');
const root = ReactDOMClient.createRoot(container);

root.render(
  <BrowserRouter>
    <Provider
      store={createStoreWithMiddleware(
        Reducer,
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )} // redux dev tools를 사용하기 위한 Extension
    >
      <App />
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
