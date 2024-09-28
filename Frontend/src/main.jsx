import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import './index.css'

const root = createRoot(document.getElementById('root'));

root.render(
<Auth0Provider
    domain="dev-wqatfnwlhvt7og2v.us.auth0.com"
    clientId="WR6TeZ2VaqWK3IELiCR6DNzng9m48d9b"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <App />
  </Auth0Provider>,
);