import './bootstrap/css/bootstrap.min.css';
// import './main.css';
import './inspector.css';

import React from 'react';
import { render } from 'react-dom';

import App from './App';

const node = document.getElementById('app');

render(
  <App />,
  node
);
