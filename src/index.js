var React = require('react');
var ReactDOM = require('react-dom/client');
require('./index.css');
var App = require('./App');

var container = document.getElementById('root');
var root = ReactDOM.createRoot(container);
root.render(React.createElement(App));
