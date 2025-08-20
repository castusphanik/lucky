import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.scss';
import 'devextreme/dist/css/dx.light.css';
import config from 'devextreme/core/config';
import { licenseKey } from './license/devextreme-license';
import { Provider } from 'react-redux';
import store from './redux/store.ts';
import ToastProvider from './components/Toaster';

// Configure DevExtreme license
config({ licenseKey });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  </StrictMode>
);
