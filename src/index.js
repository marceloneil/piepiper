import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/react-image-gallery/styles/css/image-gallery-no-icon.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
