// AppRouter.js
import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import ErrorPage from '../ErrorHandlers/ErrorPage';
import { Context } from '../index';
import { ERROR_ROUTE } from '../utils/consts';

const AppRouter = () => {
  const { user } = useContext(Context);
 console.log("Current route:", window.location.pathname);

  return (
    <Routes>
      {user.isAuth && authRoutes.map(({ path, Component }) =>
        <Route key={path} path={path} element={<Component />} />
      )}
      {publicRoutes.map(({ path, Component }) =>
        <Route key={path} path={path} element={<Component />} />
      )}
      {/* Маршрут для страницы ошибки */}
      <Route path={ERROR_ROUTE+"/:errorCode"} element={<ErrorPage />} />
      <Route path="*" element={<Navigate to={ERROR_ROUTE+'/404'} replace />} />
    </Routes>
  );
};

export default AppRouter;
