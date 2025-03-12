import Pagination from 'react-bootstrap/Pagination';

import React, { useContext } from 'react';
import { Row } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';

import ItemsHorScroll from './ItemsHorScroll';

const Pages = observer(({item}) => {
  const pageCount=Math.ceil(item.totalCount / item.limit)
  console.log("ЧИСЛО элементов",item.totalCount)
  const pages=[]
  for(let i=0;i < pageCount; i++){
    pages.push(i+1)
  }
  return(
    <Pagination className='mt-5'>
      {pages.map(page =>
          <Pagination.Item
            key={page}
            active={item.page === page}
            onClick={()=>item.setPage(page)}
          >{page}</Pagination.Item>                      
      )}
    </Pagination>
  )
});

export default Pages;

