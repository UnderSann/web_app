// App.js
import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';
import { observer } from 'mobx-react-lite';
import { Spinner } from 'react-bootstrap';
import { Context } from './index.js';
import { check } from './https/userAPI';
import Loading from './components/Loading.js'
import { useNavigate } from 'react-router-dom';
import { useToast, UpWindowMessage } from './components/UpWindowMessage';

import ErrorPage from './ErrorHandlers/ErrorPage'; // Импорт страницы ошибки
import Footer from './components/Footer.js';

const App = observer(() => {
  const { user, error } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

useEffect(() => {
        if (error.errorLight) {
          showToast(error.errorLight, 'danger');
          error.clearErrorLight(); 
        }
    }, [error.errorLight]);
  useEffect(() => {
    check().then(data => {
      if (data) {
        user.setUser(data);
        console.log(data)
        user.setIsAuth(true);
      }
    }).finally(() => setLoading(false));
  }, []);

  // Перенаправление на страницу ошибки при изменении кода ошибки
  useEffect(() => {
    if ((error.errorCode && error.errorMessage) ||error.errorCode==404) {
      console.log("errorCode: "+error.errorCode+"; errorMessage: "+error.errorMessage)

      navigate(`/error/${error.errorCode}`);
    }
  }, [error.errorCode],navigate);
  //console.log("код:"+error.errorCode+"; Cooбщение:"+error.errorMessage)
  if (loading) {
    return <Loading />;
  }

  return (
    <>
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <NavBar/>
      <div className="flex-grow-1">
        <AppRouter />
      </div>
      <UpWindowMessage toast={toast} />
      <Footer />
    </div>
    </>
  );
});

export default App;
