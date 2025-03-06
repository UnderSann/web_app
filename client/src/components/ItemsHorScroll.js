import React, { useContext,useEffect, useState } from 'react';
import { Button, Card,Spinner } from 'react-bootstrap';
import { fetchItems } from '../https/itemAPI';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw from './ItemPreveiw';
import { List } from 'react-bootstrap-icons';

const ItemsHorScroll = observer(({ type }) => {
    const { item } = useContext(Context);
    const [localItems, setLocalItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (type.id !== -1) {  // Загружаем только если это не "Все товары"
            setLoading(true);
            fetchItems(type.typeId, 1, item.onMain + 1).then(data => {
                setLocalItems(data.rows);
            }).finally(() => setLoading(false));
        } else {
            setLocalItems(item.items); // "Все товары" берём из общего списка
            setLoading(false);
        }
    }, [type]);

    if (loading) return <Spinner animation="grow" style={{ transform: 'scale(1.5)' }} />;
    
    return (
        <div key={type.id} className='mb-3'>
            <Card onClick={() => item.setSelectedType(type)} className="p-3 d-flex">
                <div className="d-flex align-items-center">
                    <List className="me-2" />
                    {type.name}
                </div>
            </Card>

            <div className="d-flex overflow-auto mt-1" style={{ whiteSpace: "nowrap" }}>
                {localItems.length > 0 ? (
                    localItems.map(item => <ItemPreveiw key={item.id} item={item} />)
                ) : (
                    <div className="p-3 text-muted">В настоящее время нет такого товара</div>
                )}
                
                {localItems.length > item.onMain && (
                    <Button variant="outline-dark" onClick={() => item.setSelectedType(type)} className="m-3">
                        Показать больше
                    </Button>
                )}
            </div>
        </div>
    );
});

export default ItemsHorScroll;
