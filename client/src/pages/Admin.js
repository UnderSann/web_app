import React, { useContext, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'react-bootstrap-icons';
import OrdersAdministrator from '../components/OrdersAdministrator';
import AddItemAdministrator from '../components/AddItemAdministrator';
const Admin = observer(() => {
    const { paths,order } = useContext(Context);
    const navigate = useNavigate();

    const [view, setView] = useState('admin');

    const handleAddItem = () => {
       setView('addItem');
    };

    const handleViewOrders = () => {
        setView('orders');
        order.setPage(1);
    };

    const handleBack = () => {
        if (view !== 'admin') {
            setView('admin');
        } else {
            navigate(paths.pop());
        }
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            <div
                className="position-absolute w-100 d-flex justify-content-between align-items-center px-4"
                style={{ top: '80px', left: 0, right: 0, height: '60px', zIndex: 10 }}
            >
                <Button variant="outline-secondary" onClick={handleBack}>
                    <ArrowLeft className="me-2" />
                    Назад
                </Button>
                <h4 className="mb-0">Панель администратора</h4>
            </div>

            {/* Контент строго по центру */}
            <Container
                className="d-flex flex-column align-items-center"
                style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '140px' }} // 80px (navbar) + 60px (панель)
            >
                <div style={{paddingTop:'20px'}}>
                {view === 'admin' && (
                    <div className="d-flex flex-column align-items-center gap-3">
                        <Button variant="primary" size="lg" onClick={handleAddItem}>
                            Добавление товара
                        </Button>
                        <Button variant="success" size="lg" onClick={handleViewOrders}>
                            Просмотр заказов
                        </Button>
                    </div>
                )}

                {view === 'orders' && (
                    <div className="">
                        <OrdersAdministrator />
                    </div>
                )}   
                {view === 'addItem' && (
                    <div className="">
                        <AddItemAdministrator isEdit={false}/>
                    </div>
                )}
                </div>
            </Container>
        </div>
    );
});

export default Admin;
