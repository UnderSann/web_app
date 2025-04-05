import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Form, Image, Alert } from "react-bootstrap";
import { Context } from '..';
import { createOrder, deleteOrder, fetchUserOrders } from '../https/orderAPI';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import { deleteFromBasket } from '../https/basketAPI';
import Loading from '../components/Loading';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { parsePhoneNumber } from 'libphonenumber-js';
import { motion } from "framer-motion";
import '../styles/OrderTabsAnimation.css';


const OrderModal = ({ show, onHide }) => {
    const { toast, showToast } = useToast();
    const { user, item, basket, order } = useContext(Context);
    const [error, setError] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState('');
    const [text, setText] = useState('');
    const [number, setNumber] = useState('');
    const [inst, setInst] = useState('');
    const [orders, setOrders] = useState([]);
    const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
    const [isFormChanged, setIsFormChanged] = useState(false);
    const [showConfirmExit, setShowConfirmExit] = useState(false);
    const [countryName, setCountryName] = useState('');
    const nodeRef = useRef(null);
    const basketItem = basket.basketItems[0];
    const [swipeDirection, setSwipeDirection] = useState('left');
    const [loadingItems, setLoadingItems] = useState(true);

    const maxAvailable = process.env.REACT_APP_ORDER_LIMIT - order.orders.length;

    useEffect(() => {
        if (basketItem) {
            setQuantity(basketItem.quantity);
        }
    }, [basketItem, show]);

    useEffect(() => {
        setOrders(prevOrders => {
            const updated = [...prevOrders];
            const limitedQty = Math.min(quantity || 1, maxAvailable);
            if (limitedQty > updated.length) {
                while (updated.length < limitedQty) updated.push({});
            } else if (limitedQty < updated.length) {
                updated.length = limitedQty;
            }
            return updated;
        });
    }, [quantity, maxAvailable]);
    

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
    }, [user?.user?.id, show]);

    if (loadingItems) return <Loading />;

    const handleSubmit = async () => {
        if (maxAvailable >= quantity) {
            try {
                let msgErr = "";
                for (let i = 0; i < quantity; i++) {
                    const currentOrder = orders[i];
                    if (!currentOrder.selectedColor) {
                        msgErr += "Укажите цвет";
                        if (quantity !== 1) msgErr += ` (вкладка ${i + 1})`;
                        msgErr += "; ";
                    }
                }

                if (!number) {
                    msgErr += "Укажите номер телефона; ";
                } else {
                    try {
                        const parsed = parsePhoneNumber(number);
                        if (!parsed?.isValid()) {
                            msgErr += "Некорректный номер телефона; ";
                        }
                    } catch {
                        msgErr += "Неверный формат номера телефона; ";
                    }
                }

                setError(msgErr.trim());
                if (msgErr === "") {
                    for (let i = 0; i < quantity; i++) {
                        await createOrder(
                            user.user.id,
                            item.items.id,
                            1,
                            orders[i].selectedColor,
                            orders[i].text,
                            inst,
                            number
                        );
                    }

                    let itemsInBasket = basketItem ? basketItem.quantity : 0;
                    const removeCount = Math.min(quantity, itemsInBasket);

                    for (let i = 0; i < removeCount; i++) {
                        const data = await deleteFromBasket(user.user.id, item.items.id, basket.page, basket.limit, 1);
                        if (data) {
                            basket.setBasketItems(data.rows);
                            itemsInBasket--;
                        }
                    }

                    onHide();
                    resetForm();
                    showToast(quantity > 1 ? 'Заказы оформлены успешно' : 'Заказ оформлен успешно', 'success');
                }
            } catch (e) {
                setError(e.response?.data?.message || 'Ошибка оформления заказа');
            }
        } else {
            setError('Допустимое количество заказов уже висит на рассмотрении (' + process.env.REACT_APP_ORDER_LIMIT + '). Ожидайте их принятия и полного изготовления или уменьшите колличество заказываемых товаров');
        }
    };

    const resetForm = () => {
        setSelectedColor('');
        setQuantity(1);
        setText('');
        setError('');
        setNumber('');
        setInst('');
        setOrders([]);
        setIsFormChanged(false);
    };

    const handleOrderChange = (index, field, value) => {
        const updatedOrders = [...orders];
        updatedOrders[index] = { ...updatedOrders[index], [field]: value };
        setOrders(updatedOrders);
        setIsFormChanged(true);
    };

    const nextOrder = () => {
        if (currentOrderIndex < Math.max(quantity, 1) - 1) {
            setSwipeDirection('left');
            setCurrentOrderIndex(currentOrderIndex + 1);
        }
    };
    
    const prevOrder = () => {
        if (currentOrderIndex > 0) {
            setSwipeDirection('right');
            setCurrentOrderIndex(currentOrderIndex - 1);
        }
    };
    

    const handleExit = () => {
        if (isFormChanged) {
            setShowConfirmExit(true);
        } else {
            onHide();
            resetForm();
        }
    };

    const confirmExit = () => {
        setShowConfirmExit(false);
        onHide();
        resetForm();
    };

    const cancelExit = () => {
        setShowConfirmExit(false);
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

                    <Form.Group className="mb-3">
                        <Form.Label>Количество</Form.Label>
                        <div className="d-flex align-items-center justify-content-center" style={{ gap: '10px' }}>
                            <Button 
                                variant="outline-secondary" 
                                onClick={() => {
                                    if (quantity > 1) {
                                        setQuantity(quantity - 1);
                                        setCurrentOrderIndex(0);
                                        setIsFormChanged(true);
                                        setError("");
                                    }
                                }}
                                style={{ width: 40, height: 40, fontSize: '20px', padding: 0 }}
                            >−</Button>

                            <Form.Control 
                                type="text"
                                value={quantity === 0 ? '' : quantity}
                                onChange={(e) => {
                                    const input = e.target.value.replace(/\D/g, '');
                                    const val = input === '' ? 0 : Number(input);
                                    if (val > maxAvailable) {
                                        setError("Количество превышает доступные места для заказа");
                                    } else {
                                        setError("");
                                    }
                                    setQuantity(val);
                                    setCurrentOrderIndex(0);
                                    setIsFormChanged(true);
                                }}
                                className="text-center"
                                style={{
                                    width: 60,
                                    height: 40,
                                    fontSize: '18px',
                                    borderRadius: '8px',
                                    border: '1px solid #ccc',
                                    appearance: 'textfield',
                                }}
                            />


                            <Button 
                                variant="outline-secondary" 
                                onClick={() => {
                                    if (quantity < maxAvailable) {
                                        setQuantity(quantity + 1);
                                        setCurrentOrderIndex(0);
                                        setIsFormChanged(true);
                                        setError("");
                                    } else {
                                        setError("Вы достигли лимита активных заказов");
                                    }
                                }}
                                style={{ width: 40, height: 40, fontSize: '20px', padding: 0 }}
                            >+</Button>
                        </div>

                        {basketItem && (
                            <small className="text-muted d-block text-center mt-1">
                                В корзине: {basketItem.quantity}
                            </small>
                        )}
                    </Form.Group>

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

                    <div style={{ display: 'flex', overflow: 'hidden' }}>
                        <motion.div
                            key={currentOrderIndex}
                            initial={{ x: swipeDirection === 'left' ? 300 : -300, opacity: 1 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: swipeDirection === 'left' ? -300 : 300, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', width: '100%' }}
                        >
                            <div style={{ width: '100%' }}>
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
                            </div>
                        </motion.div>
                    </div>

                    <Form.Group className="mb-3">
                        <Form.Label>Номер телефона</Form.Label>
                        <PhoneInput
                            international
                            defaultCountry="BY"
                            value={number}
                            onChange={(value) => {
                                setNumber(value);
                                try {
                                    const phoneNumber = parsePhoneNumber(value || '');
                                    const country = phoneNumber?.country || '';
                                    setCountryName(country);
                                } catch {
                                    setCountryName('');
                                }
                            }}
                            className="form-control"
                        />
                        {countryName && (
                            <div className="mt-1 text-muted">
                                Страна: <strong>{countryName}</strong>
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Instagram</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={inst}
                            onChange={(e) => setInst(e.target.value)}
                            placeholder="Ваш Instagram" 
                        />
                    </Form.Group>
                </Modal.Body>

                {error && error.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                        <div style={{ color: 'red', fontSize: '16px', marginLeft: '20px', marginTop: "3px", marginBottom: '3px' }}>
                            {line}<br />
                        </div>
                    </React.Fragment>
                ))}

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleExit}>Закрыть</Button>
                    <Button variant="primary" onClick={handleSubmit}>Оформить</Button>
                </Modal.Footer>
            </Modal>

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

            <UpWindowMessage toast={toast} />
        </>
    );
};

export default OrderModal;
