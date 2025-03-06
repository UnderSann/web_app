import React, { useContext } from 'react';
import { Row } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';

import ItemsHorScroll from './ItemsHorScroll';

const ItemsMain = observer(() => {
    const { item } = useContext(Context);

    if (!item || !item.types) {
        return <div>Данных нет</div>; 
    }

    return (
        
        <Row className='d-flex flex-column'>
            {/* Передаём корректный пустой объект, но создаём его в самом компоненте */}
            <ItemsHorScroll type={{ name: "Все товары", id: -1 }} />

            {/* Исправляем map() */}
            {item.types.map(type => (
                <ItemsHorScroll key={type.id} type={type} />
            ))}
        </Row>
    );
});

export default ItemsMain;
