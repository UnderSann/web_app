import React, { useContext,useState,useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container,Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import {fetchOneItem } from '../https/itemAPI';
import Loading from '../components/Loading'
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
            <Loading/>
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
