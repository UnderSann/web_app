import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Card, Spinner,NavLink } from 'react-bootstrap';
import { fetchItems } from '../https/itemAPI';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw from './ItemPreveiw';
import { List } from 'react-bootstrap-icons';
import { ITEM_ROUTE } from '../utils/consts';

const ItemsHorScroll = observer(({ type }) => {
    const { item } = useContext(Context);
    const [localItems, setLocalItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);

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

    const handleWheelScroll = (e) => {
        if (scrollRef.current && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
            e.preventDefault();
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    useEffect(() => {
        const preventWindowScroll = (e) => {
            if (scrollRef.current && scrollRef.current.contains(e.target) && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
                e.preventDefault();
            }
        };

        document.addEventListener('wheel', preventWindowScroll, { passive: false });
        return () => {
            document.removeEventListener('wheel', preventWindowScroll);
        };
    }, []);

    if (loading) return <Spinner animation="grow" style={{ transform: 'scale(1.5)' }} />;
    
    return (
        <div key={type.id} className='mb-3'>
            <Card onClick={() => item.setSelectedType(type)} className="p-3 d-flex" >
                <div className="d-flex align-items-center">
                    <List className="me-2" />
                    {type.name}
                </div>
            </Card>

            <div 
                ref={scrollRef} 
                className="d-flex overflow-auto mt-1" 
                style={{ whiteSpace: "nowrap", cursor: "grab", minHeight: '60px' }}
                onWheel={handleWheelScroll}
            >
                {localItems.length > 0 ? (
                    localItems.map(item => <ItemPreveiw key={item.id} item={item} as={NavLink} to={ITEM_ROUTE+"/"+item.id}/>)
                ) : (
                    <div className="p-3 text-muted" style={{ minWidth: '100%' }}>В настоящее время нет такого товара</div>
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
