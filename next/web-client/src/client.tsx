import './types/global';
import React from 'react';
import Cookies from 'js-cookie';
import { hydrate } from 'react-dom';
import logger from '@rockpack/logger';
import createUssr from '@rockpack/ussr';
import { loadableReady } from '@loadable/component';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';
import StyleContext from 'isomorphic-style-loader/StyleContext';
import { LocalizationContainer } from './features/Localization';
import { App } from './App';
import { isProduction } from './utils/environments';
import { createStore } from './store';
import { createRestClient } from './utils/rest';
import { createServices } from './services';

declare global {
  interface Window {
    REDUX_DATA: {
      [key: string]: unknown;
    };
  }
}

const history = createBrowserHistory();

const [Ussr] = createUssr();

const getToken = (): string | undefined => Cookies.get('token');

const rest = createRestClient(getToken);

const { store } = createStore({
  logger,
  initState: window.REDUX_DATA,
  history,
  services: createServices(rest)
});

const insertCss = (...styles): () => void => {
  const removeCss = isProduction() ?
    [] :
    styles.map(style => style && typeof style._insertCss === 'function' && style._insertCss());
  return (): void => removeCss.forEach(dispose => dispose());
};

loadableReady(() => {
  hydrate(
    <Ussr>
      <Provider store={store}>
        <StyleContext.Provider value={{ insertCss }}>
          <ConnectedRouter history={history}>
            <LocalizationContainer>
              <App />
            </LocalizationContainer>
          </ConnectedRouter>
        </StyleContext.Provider>
      </Provider>
    </Ussr>,
    document.getElementById('root')
  );
});
