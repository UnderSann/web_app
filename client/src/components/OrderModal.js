import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form, Image, Alert } from "react-bootstrap";
import { Context } from '..';
import { createOrder, deleteOrder } from '../https/orderAPI';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import { deleteFromBasket } from '../https/basketAPI';

const OrderModal = ({ show, onHide }) => {
    const { toast, showToast } = useToast();
    const { user, item, basket } = useContext(Context);
    const [error, setError] = useState('');

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [text, setText] = useState('');
    const [tg, setTg] = useState('');
    const [inst, setInst] = useState('');
    const [orders, setOrders] = useState([]);  // Состояние для хранения всех заказов
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);  // Индекс текущего заказа
    const [isFormChanged, setIsFormChanged] = useState(false);  // Флаг изменения формы
    const [showConfirmExit, setShowConfirmExit] = useState(false);  // Флаг подтверждения выхода

    const basketItem = basket.basketItems[0];

    useEffect(() => {
        if (basketItem) {
            setQuantity(basketItem.quantity);
        }
    }, [basketItem, show]);

    useEffect(() => {
        setOrders(Array(quantity).fill({}));
    }, [quantity]);

    const handleSubmit = async () => {
        try {
            for (let i = 0; i < quantity; i++) {
                await createOrder(
                    user.user.id,
                    item.items.id,
                    1,  // quantity всегда 1 для отдельного заказа
                    orders[i].selectedColor,
                    orders[i].text,
                    orders[i].inst,
                    orders[i].tg
                );
            }
    
            // Количество товаров в корзине
            let itemsInBasket = basketItem ? basketItem.quantity : 0;
    
            // Определяем сколько раз можно удалить
            const removeCount = Math.min(quantity, itemsInBasket);
    
            // Удаляем товары, пока они есть в корзине
            for (let i = 0; i < removeCount; i++) {
                const data = await deleteFromBasket(user.user.id, item.items.id, basket.page, basket.limit, 1);
                if (data) {
                    basket.setBasketItems(data.rows);
                    itemsInBasket--;  // Обновляем локальный счётчик
                }
            }
    
            // Проверяем, не вызовем ли ошибку, если в корзине товаров больше нет
            if (quantity > itemsInBasket && itemsInBasket > 0) {
                const data = await deleteFromBasket(user.user.id, item.items.id, basket.page, basket.limit, 1);
                if (data) {
                    basket.setBasketItems(data.rows);
                }
            }
    
            onHide();
            resetForm();
            showToast(quantity > 1 ? 'Заказы оформлены успешно' : 'Заказ оформлен успешно', 'success');
        } catch (e) {
            setError(e.response?.data?.message || 'Ошибка оформления заказа');
        }
    };
    
    const resetForm = () => {
        setSelectedColor('');
        setQuantity(1);
        setText('');
        setError('');
        setTg('');
        setInst('');
        setOrders([]);  // Сбрасываем заказы
        setIsFormChanged(false);  // Сбрасываем флаг изменения формы
    };

    const handleOrderChange = (index, field, value) => {
        const updatedOrders = [...orders];
        updatedOrders[index] = { ...updatedOrders[index], [field]: value };
        setOrders(updatedOrders);
        setIsFormChanged(true);  // Отмечаем, что форма была изменена
    };

    const nextOrder = () => {
        if (currentOrderIndex < quantity - 1) {
            setCurrentOrderIndex(currentOrderIndex + 1);
        }
    };

    const prevOrder = () => {
        if (currentOrderIndex > 0) {
            setCurrentOrderIndex(currentOrderIndex - 1);
        }
    };

    const handleExit = () => {
        if (isFormChanged) {
            setShowConfirmExit(true);  // Показать окно подтверждения
        } else {
            onHide();
            resetForm();
        }
    };

    const confirmExit = () => {
        setShowConfirmExit(false);  // Скрыть окно подтверждения
        onHide();
        resetForm();
    };

    const cancelExit = () => {
        setShowConfirmExit(false);  // Закрыть окно подтверждения
    };

    return (
        <>
            <Modal show={show} onHide={handleExit}>
                <Modal.Header closeButton>
                    <Modal.Title>Оформление заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center justify-content-between">
                        <h5>{item.items.name} - {item.items.price} BYN</h5>
                        {item.items.imgs?.[0] && (
                            <Image 
                                src={process.env.REACT_APP_API_URL + item.items.imgs[0].img}
                                alt="Товар" 
                                style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 5 }} 
                            />
                        )}
                    </div>

                    {/* Поле с количеством сверху */}
                    <Form.Group className="mb-3">
                        <Form.Label>Количество</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="1" 
                            value={quantity || ""}
                            onChange={(e) => {
                                setQuantity(Number(e.target.value));
                                setOrders(Array(Number(e.target.value)).fill({}));  // Обновляем массив заказов
                                setCurrentOrderIndex(0);  // Сбрасываем индекс текущего заказа
                                setIsFormChanged(true);  // Фиксируем изменение формы
                            }} 
                            placeholder="Введите количество"
                        />
                        {basketItem && <small className="text-muted">Количество товара в корзине: {basketItem.quantity}</small>}
                    </Form.Group>

                    {/* Переключение между заказами (если количество больше 1) */}
                    {quantity > 1 && (
                        <div className="d-flex justify-content-between mb-3">
                            <Button variant="secondary" onClick={prevOrder} disabled={currentOrderIndex === 0}>
                                ← Предыдущий заказ
                            </Button>
                            <span>Заказ №{currentOrderIndex + 1}</span>
                            <Button variant="secondary" onClick={nextOrder} disabled={currentOrderIndex === quantity - 1}>
                                Следующий заказ →
                            </Button>
                        </div>
                    )}

                    {/* Отображение текущего заказа */}
                    <div>
                        {item.items.colors?.length > 0 && (
                            <Form.Group className="mb-3">
                                <Form.Label>Выберите цвет</Form.Label>
                                <div className="d-flex align-items-center">
                                    <Form.Select 
                                        value={orders[currentOrderIndex]?.selectedColor || ''}
                                        onChange={(e) => handleOrderChange(currentOrderIndex, 'selectedColor', e.target.value)}
                                        style={{ flex: 1 }}
                                    >
                                        <option value="">Не выбрано</option>
                                        {item.items.colors.map(color => (
                                            <option key={color.id} value={color.id}>{color.name}</option>
                                        ))}
                                    </Form.Select>
                                    {orders[currentOrderIndex]?.selectedColor && (
                                        <span 
                                            style={{
                                                width: '20px',
                                                height: '20px',
                                                backgroundColor: item.items.colors.find(c => c.id === Number(orders[currentOrderIndex].selectedColor))?.code, 
                                                marginLeft: '10px',
                                                border: '1px solid #000',
                                                display: 'inline-block'
                                            }}
                                        ></span>
                                    )}
                                </div>
                            </Form.Group>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Текст</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={orders[currentOrderIndex]?.text || ''}
                                onChange={(e) => handleOrderChange(currentOrderIndex, 'text', e.target.value)}
                                placeholder="Введите текст" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Telegram</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={orders[currentOrderIndex]?.tg || ''}
                                onChange={(e) => handleOrderChange(currentOrderIndex, 'tg', e.target.value)}
                                placeholder="Ваш Telegram" 
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={orders[currentOrderIndex]?.inst || ''}
                                onChange={(e) => handleOrderChange(currentOrderIndex, 'inst', e.target.value)}
                                placeholder="Ваш Instagram" 
                            />
                        </Form.Group>
                    </div>
                </Modal.Body>
                {error && <div style={{ color: 'red', fontSize: '16px', marginLeft: '20px', marginBottom: '10px' }}>{error}</div>}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleExit}>Закрыть</Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Оформить
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Подтверждение выхода */}
            <Modal show={showConfirmExit} onHide={cancelExit}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Вы уверены, что хотите выйти? Все введённые данные будут потеряны.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelExit}>Отменить</Button>
                    <Button variant="primary" onClick={confirmExit}>Да, выйти</Button>
                </Modal.Footer>
            </Modal>

            {/* Рендерим всплывающее сообщение */}
            <UpWindowMessage toast={toast} />
        </>
    );
};

export default OrderModal;
