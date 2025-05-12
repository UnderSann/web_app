import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Context } from '..';
import FilterModal from './FilterModal';
import { SHOP_ROUTE } from '../utils/consts';

const SearchInput = () => {
  const { item } = useContext(Context);
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const location=useLocation()
    useEffect(() => {
    if (!item.isSearchFilled) {
      setQuery(''); // очищаем строку поиска
      
    }
  }, [item.isSearchFilled]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (query!=='') {
        params.set('search', query);
        params.set('typeId', 0);
      } else {
        params.delete('search');
        params.set('typeId', item.selectedType.id);
        item.setIsSearchFilled(false);
      }
    if (location.pathname === SHOP_ROUTE) {
      navigate(`${SHOP_ROUTE}?${params.toString()}`, { replace: true });
    item.setIsSearchFilled(true);
    }    }, 10);

    return () => clearTimeout(timeoutId);
  }, [query]);
  return (
    <>
      <InputGroup style={{ maxWidth: 450, flexGrow: 1 }}>
        <Form.Control
          type="search"
          placeholder="Поиск"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          variant="outline-dark"
          onClick={() => setShowFilter(true)}
          style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          Фильтры
        </Button>
      </InputGroup>

      <FilterModal show={showFilter} handleClose={() => setShowFilter(false)} />
    </>
  );
};

export default SearchInput;
