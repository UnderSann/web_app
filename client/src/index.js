import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import UserStore from './store/UserStore.js';
import ItemStore from './store/ItemStore.js';

export const Context = createContext(null)

// Создаем корень для рендеринга
const root = ReactDOM.createRoot(document.getElementById('root'));


// Рендерим приложение
root.render(
  <React.StrictMode>
    <Context.Provider value={{
      user: new UserStore(),
      item: new ItemStore()
    }}>
    <App />
    </Context.Provider>
  </React.StrictMode>
);
