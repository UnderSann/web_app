import Pagination from 'react-bootstrap/Pagination';

import React, { useContext } from 'react';
import { Row } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';

import ItemsHorScroll from './ItemsHorScroll';

const Pages = observer(() => {
    let active = 2;
    let items = [];
    for (let number = 1; number <= 5; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active}>
          {number}
        </Pagination.Item>,
      );
    }
    
    const paginationBasic = (
      <div>
        <Pagination>{items}</Pagination>
        <br />
    
        <Pagination size="lg">{items}</Pagination>
        <br />
    
        <Pagination size="sm">{items}</Pagination>
      </div>
    );
    
    render(paginationBasic);
});

export default Pages;

