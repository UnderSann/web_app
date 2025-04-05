import React, {useContext, useState, useEffect  } from 'react';
import { Card, Image,Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ITEM_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { Trash,Pen } from 'react-bootstrap-icons';
import { deleteOrder, fetchUserOrders } from '../https/orderAPI';
import { Context } from '..';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';

import Loading from './Loading'
const OrdersPreview = observer(({ orderItem }) => {
    const {user,order}=useContext(Context)
    const navigate = useNavigate();
    const location = useLocation();
    const { toast, showToast } = useToast();

    const handleCardClick = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
            return;
        }
        navigate(ITEM_ROUTE + '/' + orderItem.item.id);
    };
    const delOrder = async () => {
        console.log(orderItem.id)
        try {
            const data = await deleteOrder(orderItem.id); // <--- добавил await
            if (data) {
                const fetchData= await fetchUserOrders(user.user.id)
                if(fetchData){
                    order.setOrder(fetchData);  
                }
                showToast(data.message); 
            }
        } catch (e) {
            console.error("Ошибка удаления заказа:", e.response?.data?.message || e.message);
        }
    };

    return (
        <Card
            key={orderItem.id}
            className="m-2 d-flex flex-row align-items-center"
            style={{
                minWidth: 400,
                maxWidth: 800,
                minHeight: 200,
                cursor: "pointer",
                whiteSpace: "normal",
                wordWrap: "break-word",
            }}
            border="dark"
            onClick={handleCardClick}
        >
            <div className="d-flex flex-row align-items-start w-100">
                <Image
                    className="me-3"
                    width={190}
                    height={190}
                    src={process.env.REACT_APP_API_URL + orderItem.item.imgs[0].img}
                    style={{ objectFit: 'cover' }}
                />
                <div className="d-flex flex-column flex-grow-1">
                    <div className="text-start fw-bold">{orderItem.item.name}</div>
                    <div className="text-start text-muted">{orderItem.text || 'Без комментариев'}</div>
                    <div className="text-start text-muted">
                        Цвет: {orderItem.color.name}
                        <span
                            style={{
                                display: 'inline-block', // Добавляем
                                width: '20px',
                                height: '20px',
                                backgroundColor: orderItem.color.code,
                                marginLeft: '5px',
                                border: '1px solid #000',
                                verticalAlign: 'middle', // Центрируем относительно текста
                            }}
                        ></span>
                    </div>
                </div>

                
                <div className="d-flex flex-column justify-content-center text-end ms-auto m-2">
                    <div>{orderItem.item.price} BYN</div>
                    <div className="text-muted">Кол-во: {orderItem.quantity}</div>
                    <Button
                        variant="outline-dark"
                        className="m-1"
                        style={{ width: 50, height: 40 }}
                        onClick={() =>delOrder()}
                    >
                        <Pen/>
                    </Button>    
                    <Button
                        variant="outline-dark"
                        className="m-1"
                        style={{ width: 50, height: 40 }}
                        onClick={() =>delOrder()}
                    >
                        <Trash/>
                    </Button>    
                </div>
            </div>
             <UpWindowMessage toast={toast} />
        </Card>
    );
});

export default OrdersPreview;
