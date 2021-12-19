/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import "@babel/polyfill";

// Import all the third party stuff
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "connected-react-router";
import FontFaceObserver from "fontfaceobserver";
import history from "utils/history";
import "./styles/app.scss";

// Import root app
import App from "containers/App";

// Import Language Provider
// import LanguageProvider from 'containers/LanguageProvider';

// Load the favicon and the .htaccess file
import "!file-loader?name=[name].[ext]!./favicon.ico";
import "!file-loader?name=[name].[ext]!./browserconfig.xml";
import "!file-loader?name=[name].[ext]!./favicon-16x16.png";
import "!file-loader?name=[name].[ext]!./favicon-32x32.png";
import "!file-loader?name=[name].[ext]!./safari-pinned-tab.svg";
import "!file-loader?name=[name].[ext]!./site.webmanifest";
import "!file-loader?name=[name].[ext]!./mstile-150x150.png";

import "!file-loader?name=[name].[ext]!./apple-touch-icon-152x152.png";
import "!file-loader?name=[name].[ext]!./android-chrome-192x192.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-60x60.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-144x144.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-120x120.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-precomposed.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-76x76.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-72x72.png";
import "!file-loader?name=[name].[ext]!./android-chrome-256x256.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-57x57.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-180x180.png";
import "!file-loader?name=[name].[ext]!./apple-touch-icon-114x114.png";

import "file-loader?name=.htaccess!./.htaccess";
// eslint-disable-line import/extensions

import configureStore from "./configureStore";

Number.prototype.toFixedCustom = function(decimals) {
  const base = Math.pow(10, decimals);
  // console.log('toFixedCustom', this, decimals, Math.round((this + Number.EPSILON) * base) / base);
  return Math.round((this + Number.EPSILON) * base) / base;
};

// Observe loading of Open Sans (to remove open sans, remove the <link> tag in
// the index.html file and this observer)
const openSansObserver = new FontFaceObserver("Open Sans", {});

// When Open Sans is loaded, add a font-family using Open Sans to the body
openSansObserver.load().then(() => {
  document.body.classList.add("fontLoaded");
});

// Create redux store with history
const initialState = {};
const store = configureStore(initialState, history);
const MOUNT_NODE = document.getElementById("app");

const render = messages => {
  ReactDOM.render(
    <Provider store={store}>
      {/* <LanguageProvider messages={messages}> */}
      <ConnectedRouter history={history}>
        <App history={history} />
      </ConnectedRouter>
      {/* </LanguageProvider> */}
    </Provider>,
    MOUNT_NODE
  );
};

if (module.hot) {
  // Hot reloadable React components and translation json files
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(["containers/App"], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === "production") {
  const runtime = require("offline-plugin/runtime"); // eslint-disable-line global-require
  runtime.install({
    onUpdating: () => {
      window.log && console.log("SW Event:", "onUpdating");
    },
    onUpdateReady: () => {
      window.log && console.log("SW Event:", "onUpdateReady");
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
    onUpdated: () => {
      window.log && console.log("SW Event:", "onUpdated");
      // Reload the webpage to load into the new version
      window.location.reload();
    },

    onUpdateFailed: () => {
      window.log && console.log("SW Event:", "onUpdateFailed");
    }
  });

  // require('offline-plugin/runtime').install(); // eslint-disable-line global-require
}
