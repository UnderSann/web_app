import { useContext } from 'react';
import { addToBasket, deleteFromBasket,clearBasket } from '../https/basketAPI';
import { Context } from '..';

export const useCartActions = (showToast) => {
    const {error}=useContext(Context)
    const addToCart = async (user, item, basket) => {
        try {
            const data = await addToBasket(user.user.id, item.id, basket.page, basket.limit);
            if (data) {
                basket.setBasketItems(data.rows);
                basket.setTotalCount(data.count);
                showToast(`Добавлено в корзину: ${item.name}`, 'success');
            }
        } catch (e) {
            console.log("Ошибка добавления в карзину:"+e.message)

        }
    };

    const deleteFromCart = async (user, item, basket, toClear = 0) => { 
        try {
            const data = await deleteFromBasket(user.user.id, item.id, basket.page, basket.limit, toClear);
            if (data?.rows) {
                basket.setBasketItems(data.rows);
                showToast(`Удалено из корзины: ${item.name}`, 'warning');
            } else {
                showToast(`Товар удалён, но корзина пуста`, 'info');
            }
     
        } catch (e) {
            console.log("Ошибка удаления из карзины:"+e.message)
        }
    }
     const clearCart = async (user,basket) => {
        try{
                await clearBasket(user.user.id).then(() => {
                    basket.setBasketItems([]); // Очистка элементов корзины
                    basket.setTotalCount(0); // Сбрасываем счётчик
                    basket.setPage(1);
                    showToast(`Карзина очищена`, 'warning');
                });
        }catch (e) {
            console.log("Ошибка при очистке карзины:"+e.message)

        }
    };

    return { addToCart, deleteFromCart,clearCart };
};
