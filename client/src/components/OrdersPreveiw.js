import React, { useContext, useState, useRef, useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { ITEM_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { Trash, Pen } from 'react-bootstrap-icons';
import { deleteOrder, fetchUserOrders } from '../https/orderAPI';
import { fetchOneItem,setItems } from '../https/itemAPI';
import { Context } from '..';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import PhoneInput from 'react-phone-number-input';
import parsePhoneNumber from 'libphonenumber-js';
import 'react-phone-number-input/style.css';
import OrderModal from './OrderModal';
import Loading from './Loading';

const OrdersPreview = observer(({ orderItem }) => {
    const { user, order, item } = useContext(Context);
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const data = await fetchOneItem(orderItem.itemId);
                if (data) {
                    item.setItems(data);
                    console.log(data.name);
                }
            } catch (err) {
                console.error("Ошибка при получении item:", err);
            }
        };
    
        fetchItem();
    }, [orderItem.itemId]); // будет вызываться только при изменении itemId
    const [showModal, setShowModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const textRef = useRef(null);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            const isTextOverflowing = el.scrollHeight > el.clientHeight + 1; // небольшой запас
            setIsOverflowing(isTextOverflowing);
        }
    }, [orderItem.text]);

    const toggleExpanded = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleCardClick = (e) => {
        // Останавливаем клик, если модальное окно открыто
        if (e.target.tagName === "BUTTON" || e.target.closest("button") || showModal) return;
        navigate(ITEM_ROUTE + '/' + orderItem.item.id);
    };

    const delOrder = async () => {
        try {
            const data = await deleteOrder(orderItem.id);
            if (data) {
                const fetchData = await fetchUserOrders(user.user.id);
                if (fetchData) {
                    order.setOrder(fetchData);
                }
                showToast(data.message);
            }
        } catch (e) {
            console.error("Ошибка удаления заказа:", e.response?.data?.message || e.message);
            showToast(e.response?.data?.message || e.message);
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
                whiteSpace: "normal",
                wordWrap: "break-word",
                pointerEvents: showModal ? 'none' : 'auto', // отключаем клики на карточке при открытом модальном окне
            }}
            border="dark"
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
                    <div className="text-start text-muted position-relative">
                        <div
                            ref={textRef}
                            style={{
                                maxWidth: '80%',
                                overflow: isExpanded ? 'visible' : 'hidden',
                                display: '-webkit-box',
                                WebkitLineClamp: isExpanded ? 'unset' : 3,
                                WebkitBoxOrient: 'vertical',
                                textOverflow: 'ellipsis',
                                maxHeight: isExpanded ? 'none' : '4.5em',
                                lineHeight: '1.5em',
                                whiteSpace: 'normal',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                transition: 'max-height 0.3s ease',
                            }}
                        >
                            {orderItem.text || 'Без комментариев'}
                        </div>

                        {isOverflowing && !isExpanded && (
                            <div
                                className="text-primary mt-1"
                                style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={toggleExpanded}
                            >
                                Подробнее...
                            </div>
                        )}
                        {isExpanded && (
                            <div
                                className="text-primary mt-1"
                                style={{ cursor: 'pointer', fontSize: '0.9rem' }}
                                onClick={toggleExpanded}
                            >
                                Скрыть
                            </div>
                        )}
                    </div>
                    <div className="text-start text-muted">
                        Цвет: {orderItem.color.name}
                        <span
                            style={{
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                backgroundColor: orderItem.color.code,
                                marginLeft: '5px',
                                border: '1px solid #000',
                                verticalAlign: 'middle',
                            }}
                        ></span>
                    </div>
                    <div className="text-start text-muted">
                        {orderItem.number}
                    </div>
                    <div className="text-start text-muted">
                        Instagram:{" "+orderItem.insta}
                    </div>
                </div>

                <div
                    className="d-flex flex-column justify-content-between align-items-end ms-auto me-2"
                    style={{ width: 100, minWidth: 100 }}
                >
                    <div>{orderItem.item.price} BYN</div>
                    <div className="text-muted">Кол-во: {orderItem.quantity}</div>

                    <Button
                        variant="outline-dark"
                        className="m-1"
                        style={{ width: 50, height: 40 }}
                        onClick={() => setShowModal(true)}
                    >
                        <Pen />
                    </Button>
                    <Button
                        variant="outline-dark"
                        className="m-1"
                        style={{ width: 50, height: 40 }}
                        onClick={() => delOrder()}
                    >
                        <Trash />
                    </Button>
                </div>
            </div>
            <OrderModal
                show={showModal}
                editOrder={orderItem}
                onHide={() => setShowModal(false)} // Закрытие модального окна
            />
            <UpWindowMessage toast={toast} />
        </Card>
    );
});

export default OrdersPreview;
