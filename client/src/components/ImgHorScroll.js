import React, { useEffect, useRef, useCallback } from 'react';
import { Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';

const ImgHorScroll = observer(({ item }) => {
    const scrollRef = useRef(null);
    const images = item.imgs;

    // Обработчик для горизонтального скролла
    const handleWheel = useCallback((e) => {
        const el = scrollRef.current;
        if (el && el.scrollWidth > el.clientWidth) {
            if (el.contains(e.target)) {
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            }
        }
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            el.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (el) {
                el.removeEventListener('wheel', handleWheel);
            }
        };
    }, [handleWheel]);

    return (
        <div
            ref={scrollRef}
            className="d-flex overflow-auto mt-1"
            style={{ whiteSpace: "nowrap", cursor: "grab", minHeight: '60px' }}
        >
            {images.length > 0 ? (
                images.map(img => (
                    <Image
                        key={img.id}
                        className="p-1 mx-auto d-block"
                        width={300}
                        height={350}
                        src={process.env.REACT_APP_API_URL + img.img}
                    />
                ))
            ) : (
                <div className="p-3 text-muted" style={{ minWidth: '100%' }}>
                    Нет данных
                </div>
            )}
        </div>
    );
});

export default ImgHorScroll;
