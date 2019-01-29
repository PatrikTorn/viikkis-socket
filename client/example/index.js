import React from 'react'
import ReactDOM from 'react-dom'
import App from './src/app'
import {Provider} from 'react-redux';
import store from '../src/store';
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'))
