import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Context } from '..';
import FilterModal from './FilterModal';
import { SHOP_ROUTE } from '../utils/consts';

const SearchInput = () => {
  const { item, paths } = useContext(Context);
  const [query, setQuery] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
    let isSelectedType = !(Object.keys(item.selectedType).length === 0);

  const location=useLocation()/*
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setQuery(params.get('search') || '');
}, [location.search]);
*/
    useEffect(() => {
    if (!item.isSearchFilled) {
      setQuery(''); // очищаем строку поиска
      
    }
  }, [item.isSearchFilled]);

const updateSearchParams = (updates = {}) => {
  const params = new URLSearchParams(window.location.search);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
      params.delete(key);
    } else {
      params.set(key, Array.isArray(value) ? value.join(',') : value);
    }
  });
  return params;
};


useEffect(() => {
  const isSearchEmpty = query.trim() === '';
  const params = new URLSearchParams(window.location.search);

  if (!isManualInput) return;

  if (!isSearchEmpty) {
    if (!item.isSearchFilled && location.pathname !== SHOP_ROUTE) {
      paths.push(location.pathname + location.search);
    }

    const updated = updateSearchParams({ search: query.trim() });
    item.setIsSearchFilled(true);
    item.setSelectedType(/*{ name: "Все товары", id: null }*/{ name: undefined, id: undefined });
    navigate(`${SHOP_ROUTE}?${updated.toString()}`);
  } else {
    const updated = updateSearchParams({ search: null });

    const prevPath = paths.pop();
    item.setIsSearchFilled(false);

    if (prevPath && new URL(prevPath, window.location.origin).pathname !== SHOP_ROUTE && !item.isFiltersFilled) {
      navigate(prevPath);
    } else {
      navigate(`${SHOP_ROUTE}?${updated.toString()}`);
    }
  }

  setIsManualInput(false);
}, [query]);






  return (
    <>
      <InputGroup style={{ maxWidth: 450, flexGrow: 1 }}>
      <Form.Control
        type="search"
        placeholder="Поиск"
        value={query}
        onChange={(e) => {
          setIsManualInput(true);
          setQuery(e.target.value);
        }}
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
