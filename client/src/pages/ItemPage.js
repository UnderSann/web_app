import React, { useContext,useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container,Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import {fetchOneItem } from '../https/itemAPI';

import ImgHorScroll from '../components/ImgHorScroll';

const ItemPage = observer(({}) => {
    const [item, setItem] = useState({info:[]})
    const [loadingItem, setLoadingItem] = useState(true);
    const { id } = useParams();
    useEffect(() => {
        setLoadingItem(true);
        fetchOneItem(id).then(data => {
            setItem(data)
        }).finally(() => setLoadingItem(false));
    
    }, []);
    
    if (loadingItem ) {
        return (
            <div 
                className="d-flex justify-content-center align-items-center" 
                style={{ height: '100vh' }}
            >
                <Spinner animation="grow" style={{ transform: 'scale(2)' }} />
            </div>
        );
    }
    return (
        <Container style={{ paddingTop: '80px' }}>
            <Row>
                <h1 >{item.name}</h1>
                <ImgHorScroll item={item}/>
                <div>Параметры</div>
                <div>Описание</div>
                <div>Комментарии</div>
            </Row>
        </Container>
    );
});

export default ItemPage;
