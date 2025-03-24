import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const FullscreenImg = ({ images, selectedIndex, onClose }) => {
  const [index, setIndex] = useState(selectedIndex);

  const prevImage = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextImage = () => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} // Закрытие по клику на фон
      >
        <div
          className="relative w-full h-full flex flex-col justify-center items-center"
          onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике на изображение
        >
          {/* Кнопка закрытия */}
          <button
            className="absolute top-5 right-5 text-white"
            onClick={onClose}
          >
            <X size={36} />
          </button>

          {/* Кнопка для переключения на предыдущую картинку */}
          <button
            className="absolute left-5 text-white"
            onClick={prevImage}
          >
            <ChevronLeft size={36} />
          </button>

          {/* Изображение */}
          <motion.img
            key={images[index].id}
            src={process.env.REACT_APP_API_URL + images[index].img}
            className="max-w-full max-h-full object-contain"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          />

          {/* Кнопка для переключения на следующую картинку */}
          <button
            className="absolute right-5 text-white"
            onClick={nextImage}
          >
            <ChevronRight size={36} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullscreenImg;
