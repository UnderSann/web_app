import React from 'react';
import { Card, Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';

const ItemPreveiw = observer(({ item }) => {
    return (
        <Card 
            key={item.id} 
            className="m-3" 
            style={{ 
                minWidth: 250, 
                minHeight: 350, 
                cursor: "pointer",
                whiteSpace: "normal",
                wordWrap: "break-word"
            }}
            border='dark'
        >
            {/* Изображение по центру */}
            <Image 
                className="p-1 mx-auto d-block" 
                width={240} height={290} 
                src={process.env.REACT_APP_API_URL + item.img} 
            />

            {/* Контейнер для name и price */}
            <div className="d-flex justify-content-between align-items-center" 
            style={{ minHeight: 60 }}>
                <div className="m-2 text-start">
                    {item.name}    
                </div>
                <div className="m-2 text-end">
                    {item.price+" BYN"} 
                </div>
            </div>
        </Card>    
    );
});



export default ItemPreveiw;
