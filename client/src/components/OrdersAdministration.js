import React, { useContext, useState, useEffect } from 'react';
import { Row, Container } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import Loading from '../components/Loading';
import { fetchOrders,deleteOrder } from '../https/orderAPI';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import OrdersPreveiw from '../components/OrdersPreveiw';
import { Cart } from 'react-bootstrap-icons';
import Pages from './Pages';
import { UpWindowMessage,useToast } from './UpWindowMessage';
const OrdersAdministration = observer(() => {
    const { toast, showToast } = useToast();
    const { order, paths, user } = useContext(Context);
    const navigate = useNavigate();
    const [loadingItems, setLoadingItems] = useState(true);

    useEffect(() => {
        setLoadingItems(true);
        fetchOrders(order.page, order.limit).then(data => {
            order.setOrder(data.rows);
            order.setTotalCount(data.count);
        }).finally(() => setLoadingItems(false));
    }, [order.page]);

    if (loadingItems) return <Loading />;

    return (
        <Container >
             <UpWindowMessage toast={toast} /> 
            <Row className="d-flex justify-content-center align-items-center mt-1">
                {order.orders.length !== 0 ? (
                    order.orders.map((orderItem) => (
                        <OrdersPreveiw key={orderItem.id} orderItem={orderItem} admin={true}></OrdersPreveiw>
                    ))
                ) : (
                    <div className="p-3 text-muted"  style={{ minWidth: '100%' }}>
                        Нет заказов
                    </div>
                )}
            </Row>
            <Pages item={order} />
        </Container>
    );
});

export default OrdersAdministration;
