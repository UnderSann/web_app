import React, { useContext, useEffect, useState, useRef } from 'react';
import { Button, Card, Spinner, NavLink } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchItems } from '../https/itemAPI';
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw from './ItemPreveiw';
import { List } from 'react-bootstrap-icons';
import { ITEM_ROUTE } from '../utils/consts';
import Loading from './Loading'

const ItemsHorScroll = observer(({ type }) => {
    const { item } = useContext(Context);
    const [localItems, setLocalItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef(null);
    
    const navigate = useNavigate()
    useEffect(() => {
        if (type.id !== null && type.id !== undefined) {  // Загружаем только если это не "Все товары"
            setLoading(true);
            fetchItems({ typeId: type.id?[type.id] : [], page: 1, limit: item.onMain + 1 })
            .then(data => {
                setLocalItems(data.rows);
            }).finally(() => setLoading(false));
        } else {
            setLocalItems(item.items); // "Все товары" берём из общего списка
            setLoading(false);
        }
    }, [type]);

    const handleWheelScroll = (e) => {
        if (scrollRef.current && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    useEffect(() => {
        const preventWindowScroll = (e) => {
            if (scrollRef.current && scrollRef.current.contains(e.target) && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
                e.preventDefault();
            }
        };

        // Применяем passive: false на родительский элемент
        document.addEventListener('wheel', preventWindowScroll, { passive: false });

        return () => {
            document.removeEventListener('wheel', preventWindowScroll);
        };
    }, []);

    if (loading) return <Loading/>;

    return (
        <div key={type.id} className='mb-2'>
        <Card
            onClick={() => {
                item.setSelectedType(type);
                const params = new URLSearchParams(window.location.search);
                if (type.id !== null && type.id !== undefined) {
                params.set('typeId', type.id);
                } else {
                params.delete('typeId'); // Удалить если "все товары"
                params.set('typeId', 0);

                }
                navigate(`?${params.toString()}`);
            }}
            className="p-3 d-flex"
        >

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
