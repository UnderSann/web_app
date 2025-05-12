import React, { useContext, useState, useEffect } from 'react';
import { Row, Container, Button } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import Loading from './Loading';
import { fetchOrders, deleteOrder } from '../https/orderAPI';
import { useNavigate } from 'react-router-dom';
import OrdersPreveiw from './OrdersPreveiw';
import Pages from './Pages';
import { UpWindowMessage, useToast } from './UpWindowMessage';

const OrdersAdministration = observer(() => {
    const { toast, showToast } = useToast();
    const { order, paths, user } = useContext(Context);
    const navigate = useNavigate();
    const [loadingItems, setLoadingItems] = useState(true);
    const [showAllOrders, setShowAllOrders] = useState(false); // Для отслеживания состояния

    useEffect(() => {
        setLoadingItems(true);
        fetchOrders(order.page, order.limit,showAllOrders).then(data => {
            order.setOrder(data.rows);
            order.setTotalCount(data.count);
        }).finally(() => setLoadingItems(false));
    }, [order.page,showAllOrders]);

    const toggleShowAllOrders = () => {
        setShowAllOrders(!showAllOrders);
    };

    if (loadingItems) return <Loading />;

    return (
        <Container>
            <UpWindowMessage toast={toast} /> 

            {/* Кнопка для переключения между текущими и всеми заказами */}
            <Button 
                onClick={toggleShowAllOrders} 
                className="mb-3"
                variant={showAllOrders ? "outline-secondary" : "success"}
            >
                {showAllOrders ? "Текущие заказы" : "Готовые заказы"}
            </Button>


             <Row className="d-flex justify-content-center"
                        >
                {order.orders.length !== 0 ? (
                    order.orders.map((orderItem) => (
                        <OrdersPreveiw 
                            key={orderItem.id} 
                            orderItem={orderItem} 
                            admin={true} 
                            all={showAllOrders} // Передаем параметр all
                        />
                    ))
                ) : (
                    <div className="p-3 text-muted" style={{ minWidth: '100%' }}>
                        Нет заказов
                    </div>
                )}
            </Row>

            <Pages item={order} />
        </Container>
    );
});

export default OrdersAdministration;
