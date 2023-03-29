import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter } from 'react-router-dom';
import Header from './components/header';

const root = ReactDOM.createRoot(document.getElementById('root'));

function isMobileDevice() {
	return (
		window.navigator.userAgent.indexOf('Android') > -1 ||
		window.navigator.userAgent.indexOf('iPhone') > -1 ||
		window.navigator.userAgent.indexOf('iPad') > -1 ||
		window.navigator.userAgent.indexOf('KFAPWI') > -1 ||
		window.navigator.userAgent.indexOf('iPod') > -1
	);
}

const html = document.querySelector('html');

if (isMobileDevice()) {
	html.classList.add('--is-mobile');
} else {
	html.classList.remove('--is-mobile');
}


root.render(
	<HashRouter>
		<Header />
		<App />
	</HashRouter>
);
