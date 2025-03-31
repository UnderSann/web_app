import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Button, Modal, Form, Image, ListGroup } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchOneItem } from '../https/itemAPI';
import Loading from '../components/Loading';
import ImgHorScroll from '../components/ImgHorScroll';
import { ArrowLeft } from 'react-bootstrap-icons';
import { addToCart } from '../scripts/basketScr';
import { Cart } from 'react-bootstrap-icons';
import CustomSelector from '../components/CustomSelector';
const ItemPage = observer(() => {
    const { item, basket, user, paths } = useContext(Context);
    const [loadingItem, setLoadingItem] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    // Проверяем, есть ли этот товар в корзине
    const basketItem = basket.basketItems.find(b => b.itemId === Number(id));

    // Устанавливаем количество товара (из корзины или 1)
    const [quantity, setQuantity] = useState(basketItem ? basketItem.quantity : 1);
    const [selectedColor, setSelectedColor] = useState('');

    useEffect(() => {
        setLoadingItem(true);
        fetchOneItem(id).then(data => {
            item.setItems(data);
        }).finally(() => setLoadingItem(false));
    }, []);

    const back = () => {
        navigate(paths.pop());
    };

    if (loadingItem) {
        return <Loading />;
    }

    return (
        <Container style={{ paddingTop: '80px' }}>
            <ArrowLeft 
                className="position-fixed start-0 top-30 translate-middle-y z-3"
                style={{ marginLeft: 10, marginTop: 20, width: 30, height: 30, background: 'white' }} 
                onClick={back}
            />
            <Row>
                <h1 className="mb-0 text-start">{item.items.name + " - " + item.items.price} BYN</h1>
                <ImgHorScroll item={item.items} />
                
                <Button variant="outline-dark" className="flex-grow-1 m-2" onClick={() => setShowModal(true)}>
                    Заказать
                </Button>
                <Button variant="outline-dark" className="flex-grow-1 m-2" onClick={() => addToCart(user, item.items, basket)}>
                    <Cart />
                </Button>  

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Оформление заказа</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Название, цена и изображение */}
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

                        {/* Выбор количества товара */}
                        <Form.Group className="mb-3" controlId="formQuantity">
                            <Form.Label>Количество</Form.Label>
                            <Form.Control 
                                type="number" 
                                min="1" 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))} 
                                placeholder="Введите количество"
                            />
                            {basketItem && <small className="text-muted">Количество товара загружено из корзины</small>}
                        </Form.Group>

                        {item.items.colors?.length > 0 && (
    <Form.Group className="mb-3" controlId="formColor">
        <Form.Label>Выберите цвет</Form.Label>
        <div className="d-flex align-items-center">
            <Form.Control as="select" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} custom>
                {item.items.colors?.length > 0 && (
    <CustomSelector 
        colors={item.items.colors} 
        selectedColor={selectedColor} 
        setSelectedColor={setSelectedColor} 
    />
)}

            </Form.Control>
        </div>
    </Form.Group>
)}



                        {/* Поля для контактов */}
                        <Form.Group className="mb-3" controlId="formText">
                            <Form.Label>Текст</Form.Label>
                            <Form.Control type="text" placeholder="Введите текст" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTelegram">
                            <Form.Label>Telegram</Form.Label>
                            <Form.Control type="text" placeholder="Ваш Telegram" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formInstagram">
                            <Form.Label>Instagram</Form.Label>
                            <Form.Control type="text" placeholder="Ваш Instagram" />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Закрыть</Button>
                        <Button variant="primary" onClick={() => alert(`Заказ: ${item.items.name}, ${quantity} шт., Цвет: ${selectedColor || "Не выбран"}`)}>
                            Отправить
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Вывод характеристик */}
                {(((item.items.info && item.items.info.length) > 0) || ((item.items.colors && item.items.colors.length) > 0)) && (
                    <div className="mt-4">
                        <h3>Характеристики</h3>
                        <ListGroup>
                            <h4>Цвета</h4>
                            <ListGroup.Item style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                {item.items.colors.map((color) => (
                                    color && (
                                        <div key={color.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                            <strong>{color.name}</strong>:
                                            <span
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    backgroundColor: color.code,
                                                    marginLeft: '3px',
                                                    marginRight: '3px',
                                                    border: '1px solid #000',
                                                }}
                                            ></span>
                                            <strong>;</strong><pre> </pre>
                                        </div>
                                    )
                                ))}
                            </ListGroup.Item>

                            {item.items.info.map(info => (
                                info && (
                                    <ListGroup.Item key={info.id}>
                                        <strong>{info.title}:</strong> {info.discription}
                                    </ListGroup.Item>
                                )
                            ))}
                        </ListGroup>
                    </div>
                )}

                <div className="mt-4">
                    <h4>Комментарии</h4>
                    <ListGroup>
                        <ListGroup.Item>
                            В процессе
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>
        </Container>
    );
});

export default ItemPage;
