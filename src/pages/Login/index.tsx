import React from 'react';
import './styles.scss';
import Button from '@/components/Button';
import TenLogo from '@/assets/TenLogo.svg';

const Login: React.FC = () => {
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENTID;
    const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

    const allScopes = ['openid', 'profile', 'email'];
    const scope = allScopes.join(' ');

    const redirectUri = `${window.location.origin}/verify`;
    console.log('redirect', redirectUri);

    const responseType = 'code';

    const params = new URLSearchParams();
    params.append('response_type', responseType);
    params.append('client_id', clientId);
    params.append('audience', audience);
    params.append('scope', scope);
    params.append('redirect_uri', redirectUri);

    const url = `https://${domain}/authorize?${params.toString()}`;
    window.location.replace(url);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1>Hello, Welcome to</h1>
          <h2>TEN - Customer Portal</h2>
          <p>Its your gateway to smarter fleet management.</p>
          <p>
            Access <strong>real-time insights</strong>, manage your{' '}
            <strong>leased and rented equipment</strong>, view <strong>service history</strong>,
            monitor <strong>preventive maintenance and DOT compliance</strong>, track{' '}
            <strong>roadside events</strong>, manage <strong>billing and documents</strong>, all in
            one place.
          </p>
          <p className="footer-text">Secure! Powerful! Insightful!</p>
        </div>
        <div className="login-right">
          <div className="login-box">
            <img src={TenLogo} alt="TEN Logo" className="logo" />
            <form onSubmit={handleLogin}>
              <Button type="submit" fullWidth>
                Sign In
              </Button>
            </form>
            <p className="copyright">© 2025 Copyright Ten Next Gen All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
