import React, { useContext, useState, useEffect } from 'react';
import { Row, Container } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import Loading from '../components/Loading';
import { fetchUserOrders,deleteOrder } from '../https/orderAPI';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import OrdersPreveiw from '../components/OrdersPreveiw';
import { Cart } from 'react-bootstrap-icons';
const Orders = observer(() => {
    const { order, paths, user } = useContext(Context);
    const navigate = useNavigate();
    const [loadingItems, setLoadingItems] = useState(true);
    const isMobile = window.innerWidth < 768;
    useEffect(() => {
        const loadOrders = async () => {
            if (!user?.user?.id) return;
            setLoadingItems(true);
            try {
                const data = await fetchUserOrders(user.user.id);
                order.setOrder(data);
            } catch (e) {
                console.error("Ошибка загрузки заказов:", e);
            } finally {
                setLoadingItems(false);
            }
        };
    
        loadOrders();
    }, [user?.user?.id]);
    
    if (loadingItems) return <Loading />;

    return (
        <Container style={{ paddingTop: '80px' }}>
            <ArrowLeft 
                className="position-fixed m-1 start-0 top-30 translate-middle-y z-3"
                style={{
                    marginLeft: 10, 
                    marginTop: 20, 
                    width: 30,
                    height: 30,
                 //   background: 'white'
                }} 
                onClick={() => navigate(paths.pop())}
            />

            <Row className="d-flex justify-content-center  align-items-center"
             style={{ marginTop: isMobile ? '10px' : '5px' ,
                padding: '0 5px' }}
                >
                {order.orders.length !== 0 ? (
                    order.orders.map((orderItem) => (
                        <OrdersPreveiw orderItem={orderItem} key={orderItem.id}></OrdersPreveiw>
                    ))
                ) : (
                    <div className="p-3 text-muted" style={{ minWidth: '100%' }}>
                        Нет заказов
                    </div>
                )}
            </Row>
        </Container>
    );
});

export default Orders;
