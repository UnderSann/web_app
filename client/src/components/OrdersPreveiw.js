import React, { useContext, useState, useRef, useEffect } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ITEM_ROUTE } from '../utils/consts';
import { observer } from 'mobx-react-lite';
import { Trash, Pen, Check2, Wrench } from 'react-bootstrap-icons';
import { deleteOrder, fetchUserOrders, doComfirmed, doDone } from '../https/orderAPI';
import { fetchOneItem } from '../https/itemAPI';
import { Context } from '..';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import OrderModal from './OrderModal';
import Loading from './Loading';

const OrdersPreview = observer(({ orderItem, admin = false }) => {
    const { user, order, item } = useContext(Context);
    const navigate = useNavigate();
    const { toast, showToast } = useToast();
    const [showModal, setShowModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);

    const textRef = useRef(null);

    useEffect(() => {
        if (!admin) {
            fetchOneItem(orderItem.itemId)
                .then(data => data && item.setItems(data))
                .catch(err => console.error("Ошибка при получении item:", err));
        }
    }, [orderItem.itemId]);

    useEffect(() => {
        const el = textRef.current;
        if (el) {
            setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
        }
    }, [orderItem.text]);

    const toggleExpanded = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const handleCardClick = (e) => {
        if (e.target.tagName === "BUTTON" || e.target.closest("button") || showModal) return;
        navigate(ITEM_ROUTE + '/' + orderItem.item.id);
    };

    const delOrder = async () => {
        try {
            const data = await deleteOrder(orderItem.id);
            if (data) {
                const fetchData = await fetchUserOrders(user.user.id);
                if (admin) {
                    order.setOrder(data.rows);
                    order.setTotalCount(data.count);
                } else {
                    order.setOrder(fetchData);
                }
                showToast(data.message);
            }
        } catch (e) {
            console.error("Ошибка удаления заказа:", e.response?.data?.message || e.message);
            showToast(e.response?.data?.message || e.message);
        }
    };

    const Comfirmed = async () => {
        try {
            const data = await doComfirmed(orderItem.id, order.page, order.limit);
            if (data) {
                order.setOrder(data.rows);
                order.setTotalCount(data.count);
            }
        } catch (e) {
            console.error("Ошибка заказа в процессе:", e.response?.data?.message || e.message);
        }
    };

    const Done = async () => {
        try {
            const data = await doDone(orderItem.id, order.page, order.limit);
            if (data) {
                order.setOrder(data.rows);
                order.setTotalCount(data.count);
            }
        } catch (e) {
            console.error("Ошибка подтверждения заказа:", e.response?.data?.message || e.message);
        }
    };

    return (
        <Card
            key={orderItem.id}
            className="m-2"
            style={{
                minWidth: 300,
                maxWidth: 800,
                backgroundColor: orderItem.done
                    ? 'rgba(0, 255, 0, 0.1)'
                    : orderItem.comfirmed
                        ? 'rgba(255, 255, 0, 0.1)'
                        : 'white',
                pointerEvents: showModal ? 'none' : 'auto',
            }}
            border="dark"
            onClick={handleCardClick}
        >
            <div className="d-flex w-100 p-2">
                {/* Картинка */}
                <div className="d-flex flex-column" style={{ flexShrink: 0 }}>
                <Image
                    src={process.env.REACT_APP_API_URL + orderItem.item.imgs[0].img}
                    style={{
                        width: '190px',
                        height: '190px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        objectPosition: 'center center'
                    }}
                />


                    <div className="d-flex justify-content-between align-items-center mt-2">
                       
                       {/* <div className="text-muted">Кол-во: {orderItem.quantity}</div>*/}
                    </div>

                    <div className="d-flex justify-content-start mt-1 flex-wrap">
                        {admin && (
                            <Button
                                variant="outline-dark"
                                className="me-2 mb-2"
                                style={{ width: 40, height: 40 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    Done();
                                }}
                            >
                                <Check2 />
                            </Button>
                        )}
                        <Button
                            variant="outline-dark"
                            className="me-2 mb-2"
                            style={{ width: 40, height: 40 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                !admin ? setShowModal(true) : Comfirmed();
                            }}
                        >
                            {!admin ? <Pen /> : <Wrench />}
                        </Button>
                        <Button
                            variant="outline-dark"
                            className="mb-2"
                            style={{ width: 40, height: 40 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                delOrder();
                            }}
                        >
                            <Trash />
                        </Button>
                    </div>
                </div>

                {/* Текст и остальная инфа */}
                <div className="d-flex flex-column ms-3 flex-grow-1">
                    <div className="fw-bold">{orderItem.item.name+" - "+orderItem.item.price} BYN</div>
                    <div className="text-muted position-relative">
                        <div
                            ref={textRef}
                            style={{
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
                    <div className="text-muted mt-2">
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
                    <div className="text-muted mt-1">{orderItem.number}</div>
                    <div className="text-muted mt-1">Instagram: {orderItem.insta}</div>
                </div>
            </div>

            {!admin && (
                <OrderModal
                    show={showModal}
                    editOrder={orderItem}
                    onHide={() => setShowModal(false)}
                />
            )}

            <UpWindowMessage toast={toast} />
        </Card>

    );
});

export default OrdersPreview;
