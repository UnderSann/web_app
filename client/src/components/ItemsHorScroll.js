import React, { useContext } from 'react';
import { Button, Card } from 'react-bootstrap';

import { Context } from '..';
import { observer } from 'mobx-react-lite';
import ItemPreveiw from './ItemPreveiw';
import { List } from 'react-bootstrap-icons';

const ItemsHorScroll = observer(({ type }) => {
    const { item } = useContext(Context);

    if (!item || !item.items) {
        return (
            <div className="p-3 text-muted">
                В настоящее время нет такого товара
            </div>
        );
    }

    const toItemsList = () => {
        item.setSelectedType(type);
    };

    // Функция для обработки скролла
    const onScroll = (e) => {
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY;
    };

    // Инициализируем allItems как массив
    let allItems = [];

    if (type.id === -1) { // Если это секция "Все товары"
        allItems = item.items;
    } else {
        allItems = item.items.filter(i => i.typeId === type.typeId);
    }

    const displayedItems = allItems.slice(0, 6);

    return (
        <div key={type.id} className='mb-3'>
            <Card 
                className="p-3 d-flex" 
                style={{ cursor: "pointer", whiteSpace: "normal", wordWrap: "break-word" }}
                onClick={toItemsList}
            >
                <div className="d-flex align-items-center">
                    <List className="me-2" /> {/*Иконка*/}
                    {type.name} 
                </div>
            </Card>

            <div 
                className="d-flex overflow-auto mt-1"
                style={{ whiteSpace: "nowrap" }}
                onMouseEnter={(e) => e.currentTarget.addEventListener('wheel', onScroll, { passive: false })}
                onMouseLeave={(e) => e.currentTarget.removeEventListener('wheel', onScroll)}
            >
                {displayedItems.length > 0 ? 
                    displayedItems.map(item => (
                        <ItemPreveiw key={item.id} item={item} />
                    ))
                : (
                    <div className="p-3 text-muted">
                        В настоящее время нет такого товара
                    </div>
                )}
                
                {allItems.length > 6 && (
                    <Button 
                        variant="outline-dark"
                        className="m-3" 
                        style={{ minWidth: 100, minHeight: 300, cursor: "pointer", whiteSpace: "normal", wordWrap: "break-word", textAlign: "center" }}
                        onClick={toItemsList}
                    >
                        Показать больше
                    </Button>
                )}
            </div>
        </div>
    );
});

export default ItemsHorScroll;
