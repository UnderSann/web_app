import React, { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container style={{ paddingTop: '80px' }}>
          <div className="error-page" style={{ padding: '20px', textAlign: 'center' }}>
            <h1>Произошла ошибка</h1>
            <p>{this.state.error?.message || 'Неизвестная ошибка'}</p>
            <button
              onClick={() => window.location.reload()}  // Для перезагрузки приложения
            >
              Попробовать снова
            </button>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
