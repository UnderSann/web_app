import React, { useContext, useState, useEffect } from 'react';
import { Col, Row, Spinner } from "react-bootstrap";
import { Button, Card, Container, Form } from 'react-bootstrap';
import { SHOP_ROUTE } from '../utils/consts';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw_2 from './ItemPreveiw_2';
import { fetchTypes, fetchItems } from '../https/itemAPI';

const ItemsList = observer(({ type }) => {
    const { item } = useContext(Context);
    const [loadingItems, setLoadingItems] = useState(true);

    let paramType
    if (type.id === -1) { 
        paramType=undefined
    } else {
        paramType=type.typeId
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
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}
            >
                <Spinner animation="grow" style={{ transform: 'scale(2)' }} />
            </div>
        );
    }

    let allItems = item.items;
    return (
        <Row className="d-flex justify-content-center mt-1">
            {allItems.length > 0 ?
                allItems.map(item => (
                    <ItemPreveiw_2 item={item} key={item.id} />
                ))
                : (
                    <div className="p-3 text-muted">
                        В настоящее время нет такого товара
                    </div>
                )}
        </Row>
    );
});

export default ItemsList;
