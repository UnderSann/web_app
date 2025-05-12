import React, { useContext, useState, useEffect } from 'react';
import { Row, Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchItems } from '../https/itemAPI';
import ItemsHorScroll from './ItemsHorScroll';
import Loading from './Loading';
import { useNavigate,useLocation } from 'react-router-dom';
const ItemsMain = observer(() => {
    const { item } = useContext(Context);
    const [loadingItems, setLoadingItems] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    useEffect(() => {
        console.log("EFFECT")
        setLoadingItems(true);

        // Обрабатываем null или undefined для параметра typeId
        const typeId = null; // Для всех товаров передаем null

        fetchItems({typeId,page:1, limit:(item.onMain + 1)})
            .then(data => {
                
                item.setItems(data.rows);
                item.setTotalCount(data.count);
            })
            .catch(e => {
                console.error("Error fetching items:", e);
            })
            .finally(() =>( setLoadingItems(false)));
    
    }, []);

    if (loadingItems) {
        return <Loading />;
    }

    return (
        <Row className='d-flex flex-column m-2'>
            {/* Передаём корректный пустой объект, но создаём его в самом компоненте */}
            <ItemsHorScroll type={{ name: "Все товары", id: null }} />

            {item.types.map(type => (
                <ItemsHorScroll key={type.id} type={type} />
            ))}
        </Row>
    );
});

export default ItemsMain;
