import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useExchangeCodeForTokensMutation, AuthStorage } from '@/services/auth';
import PageLoader from '@/components/PageLoader';

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [exchangeTokens, { isLoading: isExchanging, error: exchangeError }] =
    useExchangeCodeForTokensMutation();
  const exchangeInitiated = useRef(false);

  const getErrorMessage = (error: unknown): string => {
    if (!error) return 'Unknown error';
    if (typeof error === 'object' && error !== null) {
      const errorObj = error as Record<string, unknown>;
      if (
        'data' in errorObj &&
        typeof errorObj.data === 'object' &&
        errorObj.data &&
        'error' in errorObj.data
      ) {
        return String((errorObj.data as { error: string }).error);
      }
      if ('message' in errorObj && typeof errorObj.message === 'string') {
        return errorObj.message;
      }
      if ('error' in errorObj && typeof errorObj.error === 'string') {
        return errorObj.error;
      }
    }
    return 'Unknown error';
  };

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('Authorization error:', error);
      return;
    }

    if (code && !exchangeInitiated.current) {
      exchangeInitiated.current = true;
      exchangeTokens(code)
        .unwrap()
        .then(() => {
          console.log('Token exchange successful');
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('code');
          setSearchParams(newSearchParams, { replace: true });
          navigate('/');
        })
        .catch(error => {
          console.error('Token exchange failed:', error);
        });
    } else if (AuthStorage.getValidAccessToken()) {
      navigate('/');
    }
  }, [searchParams, exchangeTokens, setSearchParams, navigate]);

  if (searchParams.get('error')) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Authorization Failed</h2>
        <p style={{ color: 'red' }}>
          Error: {searchParams.get('error_description') || searchParams.get('error')}
        </p>
        <button onClick={() => navigate('/login')}>Go Back to Login</button>
      </div>
    );
  }

  if (exchangeError) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Token Exchange Failed</h2>
        <p style={{ color: 'red' }}>Error: {getErrorMessage(exchangeError)}</p>
        <button onClick={() => navigate('/login')}>Go Back to Login</button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <PageLoader isLoading={isExchanging || !AuthStorage.getValidAccessToken()} />
      {isExchanging && <p>Securely logging you in...</p>}
    </div>
  );
};

export default Verify;
