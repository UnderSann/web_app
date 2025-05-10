import React, { useState, useEffect, useContext } from 'react';
import { Form } from 'react-bootstrap';
import { Context } from '..';
import Loading from './Loading';

const SearchInput = () => {
    const { item } = useContext(Context);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        /*
        const timeoutId = setTimeout(() => {
            
            setIsLoading(false)
            item.setSearchQuery(query)
                .catch(e => console.error(e))
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(timeoutId);*/
    }, [query]);

    return (
        <Form className="d-flex flex-grow-1">
            <Form.Control
                type="search"
                placeholder="Поиск"
                className="me-2"
                style={{ minWidth: '150px', flexGrow: 1, maxWidth: 400 }}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {isLoading && <Loading />}
        </Form>
    );
};

export default SearchInput;
