import React, { useContext,useState,useEffect } from 'react';

import { Row,Spinner } from "react-bootstrap";
import { Context } from '..';
import ItemsHorScroll from './ItemsHorScroll';

const ItemsMain =() => {
    return (
        <div 
            className="d-flex justify-content-center align-items-center" 
            style={{ height: '100vh' }}
        >
            <Spinner animation="grow" style={{ transform: 'scale(2)' }} />
        </div>
);
}
export default ItemsMain;
