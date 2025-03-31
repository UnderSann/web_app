import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

// Хук для управления состоянием всплывающих уведомлений
export const useToast = () => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    return { toast, showToast };
};

// Компонент для отображения уведомлений
export const UpWindowMessage = ({ toast }) => (
    <ToastContainer
        className="position-fixed bottom-0 start-50 translate-middle-x p-3"
        style={{ zIndex: 1050, left: '50%', transform: 'translateX(-50%)' }}
    >
        <Toast
            show={toast.show}
            style={{
                backgroundColor: toast.type === 'success' ? '#FFE4C4' : '#F8D7DA',
                border: toast.type === 'success' ? '1px solid #D2B48C' : '1px solid #F5C6CB',
            }}
        >
            <Toast.Body className={toast.type === 'success' ? 'text-dark' : 'text-danger'}>
                {toast.message}
            </Toast.Body>
        </Toast>
    </ToastContainer>
);
