import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './src/App.tsx';

try {
  const html = renderToString(React.createElement(App));
  console.log("SSR SUCCESS, length:", html.length);
} catch (e) {
  console.error("SSR ERROR:");
  console.error(e);
}
