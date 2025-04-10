import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Button, Modal, Form, Image, ListGroup } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchOneItem } from '../https/itemAPI';
import Loading from '../components/Loading';
import ImgHorScroll from '../components/ImgHorScroll';
import { ArrowLeft } from 'react-bootstrap-icons';
import { useCartActions } from '../scripts/basketScr';
import { useToast, UpWindowMessage } from '../components/UpWindowMessage';
import OrderModal from '../components/OrderModal';
import { fetchOneBasket } from '../https/basketAPI';
import { Cart } from 'react-bootstrap-icons';
import { LOGIN_ROUTE, REGISTRATION_ROUTE } from '../utils/consts';

const ItemPage = observer(() => {
    const { toast, showToast } = useToast(); // Хук вызывается здесь
    const { addToCart } = useCartActions(showToast); // Передаем showToast
    const { item, basket, user, paths, order,error } = useContext(Context);
    const [loadingItem, setLoadingItem] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams();
    useEffect(() => {
        setLoadingItem(true);
        fetchOneItem(id)
            .then(data => {
                item.setItems(data);
            })
            .catch(err => {
                console.error("Ошибка загрузки товара:", err);
            })
            .finally(() => setLoadingItem(false)); // Убедитесь, что состояние обновляется корректно
    }, [id]);
    
    const [loadingBasket, setLoadingBasket] = useState(false);

    useEffect(() => {
        if (user.isAuth && user.user?.id && item.items?.id) {
            setLoadingBasket(true);
            fetchOneBasket(user.user.id, item.items.id)
                .then(basketData => {
                    basket.setBasketItems([basketData]);
                    basket.setTotalCount(1);
                })
                .catch(err => console.error("Ошибка при загрузке корзины:", err))
                .finally(() => setLoadingBasket(false));
        } else {
            basket.setBasketItems({});
            basket.setTotalCount(0);
        }
    }, [user.isAuth, user.user?.id, item.items?.id]);
    if (loadingItem||loadingBasket ) {
        return (
            <Loading/>
        );
    }
    const back = () => {
        navigate(paths.pop());
    };


    // Переход к рендерингу данных после их загрузки
    return (
        <Container style={{ paddingTop: '80px' }}>
            
            <ArrowLeft 
                className="position-fixed start-0 top-30 translate-middle-y z-3"
                style={{ marginLeft: 10, marginTop: 20, width: 30, height: 30, background: 'white' }} 
                onClick={back}
            />
            {!error.errorCode && !error.errorMessage  &&
            <Row>
                {/* Название товара и цена */}
                <h1 className="mb-0 text-start">{item.items?.name + " - " + item.items?.price} BYN</h1>
                <ImgHorScroll item={item.items}/>
                {/* Кнопки заказа */}
                <Button variant="outline-dark" className="flex-grow-1 m-2" onClick={() => {user.isAuth?setShowModal(true):showToast("Вы не авторизованы",'text-danger')}}>
                    Заказать
                </Button>
                <Button variant="outline-dark" className="flex-grow-1 m-2" onClick={() => addToCart(user, item.items, basket)}>
                    <Cart />
                </Button>

                <UpWindowMessage toast={toast} />

                {/* Модальное окно заказа */}
                {user.isAuth &&
                <OrderModal 
                    show={showModal} 
                    onHide={() => setShowModal(false)} 
                />
                }
                {/* Характеристики товара */}
                {(((item.items?.info && item.items?.info.length) > 0) || ((item.items?.colors && item.items?.colors.length) > 0)) && (
                    <div className="mt-4">
                        <h3>Характеристики</h3>
                        <ListGroup>
                            {/* Цвета */}
                            <ListGroup.Item style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                    <strong>Цвета:</strong><pre> </pre>
                                </div>
                                {item.items?.colors?.map(color => (
                                    color && (
                                        <div key={color.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                            <div>{color.name}</div>:
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
                                            <div>;</div><pre> </pre>
                                        </div>
                                    )
                                ))}
                            </ListGroup.Item>

                            {/* Описание характеристик */}
                            {item.items?.info?.map(info => (
                                info && (
                                    <ListGroup.Item key={info.id}>
                                        <strong>{info.title}:</strong> {info.discription}
                                    </ListGroup.Item>
                                )
                            ))}
                        </ListGroup>
                    </div>
                )}

                {/* Комментарии */}
                <div className="mt-4">
                    <h4>Комментарии</h4>
                    <ListGroup>
                        <ListGroup.Item>
                            В процессе
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>
            }
        </Container>
    );
});

export default ItemPage;
