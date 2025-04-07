import React, { Suspense,createContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import UserStore from './store/UserStore.js';
import ItemStore from './store/ItemStore.js';
import BasketStore from './store/BasketStore.js';
import PathStore from './store/PathStore.js';
import OrderStore from './store/OrderStore.js';
import ErrorStore from './store/ErrorStore';
import ErrorBoundary from './ErrorHandlers/ErrorBoundary.js';
export const Context = createContext(null)

// Создаем корень для рендеринга
const root = ReactDOM.createRoot(document.getElementById('root'));


// Рендерим приложение
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <ErrorBoundary>
      <Context.Provider value={{
        user: new UserStore(),
        item: new ItemStore(),
        basket: new BasketStore(),
        order: new OrderStore(),
        paths: new PathStore(),
        error: ErrorStore,
      }}>
        <Suspense fallback={<div>Loading...</div>}>
          <App />
        </Suspense>
      </Context.Provider></ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);