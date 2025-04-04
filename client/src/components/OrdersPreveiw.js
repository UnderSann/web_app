import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ITEM_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';

const OrdersPreview = observer(({ orderItem }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleCardClick = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
            return;
        }
        navigate(ITEM_ROUTE + '/' + orderItem.item.id);
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
                </div>
            </div>
        </Card>
    );
});

export default OrdersPreview;
