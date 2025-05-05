import React, { useContext,useState,useEffect } from 'react';

import { Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import { fetchTypes, fetchItems } from '../https/itemAPI';
import ItemsHorScroll from './ItemsHorScroll';
import Loading from './Loading'
import { clearBasket } from '../https/basketAPI';
const ItemsMain = observer(() => {
    const { item } = useContext(Context);
    const [loadingItems, setLoadingItems] = useState(true);
    useEffect(() => {
        setLoadingItems(true);
        fetchItems(null, 1, item.onMain + 1).then(data => {
            item.setItems(data.rows);
            item.setTotalCount(data.count);
        }).finally(() => setLoadingItems(false));
    
    }, []);
    
    if (loadingItems ) {
        return (
            <Loading/>
        );
    }

    return (
        
        <Row className='d-flex flex-column m-2'>
            {/* Передаём корректный пустой объект, но создаём его в самом компоненте */}
            <ItemsHorScroll type={{ name: "Все товары", id: -1 }} />

            {item.types.map(type => (
                <ItemsHorScroll key={type.id} type={type} />
            ))}
            
        </Row>
    );
});

export default ItemsMain;
