import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { Button, Card, Container, Form } from 'react-bootstrap';
import { ITEM_ROUTE } from '../utils/consts';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw_2 from './ItemPreveiw_2';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import { ArrowLeft } from 'react-bootstrap-icons';
import { SHOP_ROUTE, LOGIN_ROUTE } from '../utils/consts';
import Loading from './Loading'
const ItemsList = observer(({ type }) => {
    const { item } = useContext(Context);
    const isMobile = window.innerWidth < 768;
    const [loadingItems, setLoadingItems] = useState(true);
    let navigate=useNavigate()
    const toMain = () => {
        item.setSelectedType({})
        navigate(process.env.REACT_APP_MAIN_PAGE)
    }
    let paramType
    if (type.id === -1) { 
        paramType=undefined
    } else {
        paramType=type.id
    }
    useEffect(() => {
        setLoadingItems(true);
        fetchItems(paramType, item.page, item.limit).then(data => {
            item.setItems(data.rows);
            item.setTotalCount(data.count);
        }).finally(() => setLoadingItems(false));
    }, [item.page, item.selectedType]);
    


    if (loadingItems) {
        return (
            <Loading/>
        );
    }

    let allItems = item.items;
    /*
    allItems.map(item => (
            console.log("<<KK>>:"+item.colors.length)))
*/
    return (
        <>
        <ArrowLeft 
            className="position-fixed start-0 top-30 m-2 translate-middle-y z-3"
            style={{ marginLeft:10, 
                marginTop:20, 
                width:30,
                height:30,
            }} 
            onClick={() => toMain()}
        />
        <Row className="d-flex justify-content-center"
            style={{ marginTop: isMobile ? '20px' : '5px' ,
                padding: '0 5px' }}
        >
            {allItems.length > 0 ?
                allItems.map(item => (
                    
                    <ItemPreveiw_2 Item={item} isBasket={false} key={item.id} />
                ))
                : (
                    <div className="p-3 text-muted">
                        В настоящее время нет такого товара
                    </div>
                )}
        </Row>
        </>
    );
});

export default ItemsList;
