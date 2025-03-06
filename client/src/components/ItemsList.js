import React, { useContext } from 'react';
import { Col, Row } from "react-bootstrap";
import { Button, Card, Container, Form } from 'react-bootstrap';
import { SHOP_ROUTE } from '../utils/consts';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw_2 from './ItemPreveiw_2';

const ItemsList = observer(({ type }) => {
    const { item } = useContext(Context);
    if (!item || !item.items) {
        return (
            <div className="p-3 text-muted">
                Товар отсутствует
            </div>
        );
    }
    let allItems = [];

    if (type.id === -1) { // Если это секция "Все товары"
        allItems = item.items;
    } else {
        allItems = item.items.filter(i => i.typeId === type.typeId);
    }

    return (
        <Row className="d-flex justify-content-center mt-1"> {/* Центрирование Row */}
            {allItems.length > 0 ? 
                allItems.map(item => (
                        <ItemPreveiw_2 item={item} />

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
