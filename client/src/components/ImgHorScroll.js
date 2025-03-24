import React, { useEffect, useRef } from 'react';
import { Image } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';

const ItemsHorScroll = observer(({ item }) => {
    const scrollRef = useRef(null);
    const images =item.imgs;
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const openViewer = (index) => {
        setSelectedIndex(index);
        setViewerOpen(true);
      };

    const handleWheelScroll = (e) => {
        if (scrollRef.current && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
            e.preventDefault();
            scrollRef.current.scrollLeft += e.deltaY;
        }
    };

    useEffect(() => {
        const preventWindowScroll = (e) => {
            if (scrollRef.current && scrollRef.current.contains(e.target) && scrollRef.current.scrollWidth > scrollRef.current.clientWidth) {
                e.preventDefault();
            }
        };

        document.addEventListener('wheel', preventWindowScroll, { passive: false });
        return () => {
            document.removeEventListener('wheel', preventWindowScroll);
        };
    }, []);

    return (
        <div
            ref={scrollRef}
            className="d-flex overflow-auto mt-1"
            style={{ whiteSpace: "nowrap", cursor: "grab", minHeight: '60px' }}
            onWheel={handleWheelScroll}
        >
            {images.length > 0 ? (
                images.map(img => (
                    <Image
                        key={img.id} // Уникальный ключ
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

export default ItemsHorScroll;
