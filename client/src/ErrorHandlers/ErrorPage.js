// src/ErrorHandlers/ErrorPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useContext } from 'react';
import { Context } from '../index';

const ErrorPage = () => {
  const { error } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    // если нет кода ошибки, перенаправить на главную
    if (!error.errorCode) {
      navigate('/');
    }
  }, [error, navigate]);

  // Функция для безопасного парсинга JSON
  const parseMessage = (message) => {
    if (typeof message === 'string') {
      try {
        const parsed = JSON.parse(message); // пытаемся распарсить
        return parsed.message || 'Неизвестная ошибка'; // возвращаем поле message или дефолтное сообщение
      } catch (e) {
        return message; // если не получилось распарсить, возвращаем исходное сообщение
      }
    }
    return message || 'Неизвестная ошибка'; // если не строка, просто возвращаем её или дефолтное сообщение
  };

  const errorMessage = parseMessage(error.errorMessage);

  return (
    <Container style={{ paddingTop: '80px' }}>
      <div className="error-page" style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Ошибка {error.errorCode}</h1>
        <p>{errorMessage}</p>
        <button
          onClick={() => {
            error.clearError();
            navigate('/');
          }}
        >
          Вернуться на главную
        </button>
      </div>
    </Container>
  );
};

export default ErrorPage;
