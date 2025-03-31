import Pagination from 'react-bootstrap/Pagination';

import React, { useContext } from 'react';
import { Row } from "react-bootstrap";
import { Context } from '..';
import { observer } from 'mobx-react-lite';
import '../styles/PaginationStyle.css';



const Pages = observer(({item}) => {
  const pageCount=Math.ceil(item.totalCount / item.limit)
  console.log("ЧИСЛО элементов",item.totalCount)
  const pages=[]
  for(let i=0;i < pageCount; i++){
    pages.push(i+1)
  }
  return(
<div className="pagination-container">
            {pages.map((page) => (
                <button
                    key={page}
                    className={`pagination-button ${item.page === page ? 'active' : ''}`}
                    onClick={() => {
                      item.setPage(page);
                      
                      document.documentElement.scrollTop = 0; // Для HTML-документа
                      document.body.scrollTop = 0; // Для тела страницы
                      document.documentElement.style.scrollBehavior = 'auto';
                      document.body.style.scrollBehavior = 'auto';
                    }
                  } 
                >
                    {page}
                </button>
            ))}
        </div>
  )
});

export default Pages;

