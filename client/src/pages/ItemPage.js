import React, { useContext,useState,useEffect } from 'react';
import { useParams,useNavigate,useLocation   } from 'react-router-dom';
import { Container,Row,Spinner,Button,ListGroup,Badge } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import {fetchOneItem } from '../https/itemAPI';
import Loading from '../components/Loading'
import ImgHorScroll from '../components/ImgHorScroll';
import { BASKET_ROUTE } from '../utils/consts';
import { ArrowLeft } from 'react-bootstrap-icons';
import { addToCart, deleteFromCart } from '../scripts/basketScr';

import { Cart, Trash } from 'react-bootstrap-icons';
const ItemPage = observer(() => {
    const { item } = useContext(Context);
    const { basket } = useContext(Context);
    const {user} = useContext(Context);
    const { paths } = useContext(Context);
    const [loadingItem, setLoadingItem] = useState(true);
    const { id } = useParams();
    const navigate =useNavigate()
    const location = useLocation();
    useEffect(() => {
        setLoadingItem(true);
        fetchOneItem(id).then(data => {
            item.setItems(data)
        }).finally(() => setLoadingItem(false));
    
    }, []);
        const back = () => {
            navigate(paths.pop())
        }
    if (loadingItem ) {
        return (
            <Loading/>
        );
    }
  
    return (
        <Container style={{ paddingTop: '80px' }}>
             <ArrowLeft 
                         className="position-fixed start-0 top-30 translate-middle-y z-3"
                         style={{ marginLeft:10, 
                             marginTop:20, 
                             width:30,
                             height:30,
                             background:'white'
                         }} 
                        onClick={() => back()}
                    />
            <Row>
               <h1 className="mb-0 text-start">{item.items.name + " - " + item.items.price} BYN</h1>
                <ImgHorScroll item={item.items} />
                <Button variant="outline-dark" className="flex-grow-1 m-2"
                onClick={() => addToCart(user, item.items, basket)}>
                    Купить
                </Button>
                <Button variant="outline-dark" className="flex-grow-1 m-2"
                onClick={() => (addToCart(user,item.items,basket))}>
                    <Cart/>
                </Button>            
                {(((item.items.info && item.items.info.length)> 0) || ((item.items.colors && item.items.colors.length) > 0)) && (
                <div className="mt-4">
                    <h3>Характеристики</h3>
                    <ListGroup>
                    <h4>Цвета</h4>
                    <ListGroup.Item style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                        {item.items.colors.map((color) => (
                            color && (
                                <div key={color.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                    <strong >{color.name}</strong>:
                                    <span
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            backgroundColor: color.code, // Код цвета
                                            marginLeft: '3px',
                                            marginRight: '3px',
                                            border: '1px solid #000',

                                        }}
                                    ></span>
                                      <strong >;</strong><pre> </pre>
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
                        <ListGroup.Item >
                            В процессе
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </Row>
        </Container>
    );
})

export default ItemPage;
