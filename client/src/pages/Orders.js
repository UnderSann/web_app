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
/*import { webSocketAPI } from '../https/webSocketAPI';*/

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
    /*
        // === Используем webSocketAPI ===
        webSocketAPI.connect();
    
        webSocketAPI.onMessage(async (msg) => {
            if (['created', 'updated', 'deleted', 'status_changed'].includes(msg.type)) {
                if (user?.user?.id) {
                    const updated = await fetchUserOrders(user.user.id);
                    order.setOrder(updated);
                }
            }
        });
    
        return () => {
            webSocketAPI.close();
        };*/
    }, [user?.user?.id]);
    
    
 
    if (loadingItems) return <Loading />;

    return (
        <Container style={{ paddingTop: '80px' }}>
           <ArrowLeft 
                className="position-fixed start-0 translate-middle-y z-3"
                style={{ 
                    marginLeft: 0, // прижимаем к левому краю
                    top: 95, // абсолютный отступ от верха
                    width: 50, 
                    height: 30, 
                    backgroundColor: "white", // белая кнопка
                    border: "2px solid black", // черная обводка
                    borderBottomRightRadius: 10, // закругленный угол снизу справа
                    borderBottomLeftRadius: 0,
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 0
                }} 
                onClick={() => navigate(paths.pop())}
            />

        <div className="center d-flex flex-column w-100"
            style={{ alignItems:  'center',paddingLeft: isMobile ? '40px' : '0px' }}
        >
            <h1
                className="text-start"
                style={{
                    maxWidth: '800px',
                    width: '100%',
                }}
            >
               Заказы
            </h1>
        </div>
            <Row className="d-flex justify-content-center p-1"
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
