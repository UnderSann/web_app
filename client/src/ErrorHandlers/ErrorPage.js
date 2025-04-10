// src/ErrorHandlers/ErrorPage.js
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useContext } from 'react';
import { Context } from '../index';
import { BASKET_ROUTE } from '../utils/consts';

const ErrorPage = () => {
  const { error,paths } = useContext(Context);
  const navigate = useNavigate();
  const {errorCode}=useParams()

  const errorMessage = error.errorMessage || "Страница не найдена";

  return (
    <Container style={{ paddingTop: '80px' }}>
      <div className="error-page" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Ошибка {errorCode}</h1>
        <p>{errorMessage}</p>
        <button
          onClick={() => {
            error.clearError();
            navigate(paths.pop());
          }}
        >
          Продолжить
        </button>
      </div>
    </Container>
  );
};

export default ErrorPage;
