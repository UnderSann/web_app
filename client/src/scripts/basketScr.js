import { addToBasket, deleteFromBasket,clearBasket } from '../https/basketAPI';

export const useCartActions = (showToast) => {
    const addToCart = async (user, item, basket) => {
        try {
            const data = await addToBasket(user.user.id, item.id, basket.page, basket.limit);
            if (data) {
                basket.setBasketItems(data.rows);
                basket.setTotalCount(data.count);
                showToast(`Добавлено в корзину: ${item.name}`, 'success');
            }
        } catch (error) {
            showToast("Ошибка добавления в корзину", 'danger');
        }
    };

    const deleteFromCart = async (user, item, basket, toClear = 0) => { 
        try {
            const data = await deleteFromBasket(user.user.id, item.id, basket.page, basket.limit, toClear);
            if (data) {
                basket.setBasketItems(data.rows);
                showToast(`Удалено из корзины: ${item.name}`, 'warning');    
            }
     
        } catch (error) {
            showToast("Ошибка удаления из корзины", 'danger');
        }
    }
     const clearCart = async (user,basket) => {
        try{
                await clearBasket(user.user.id).then(() => {
                    basket.setBasketItems([]); // Очистка элементов корзины
                    basket.setTotalCount(0); // Сбрасываем счётчик
                    basket.setPage(1)
                    showToast(`Карзина очищена`, 'warning');
                });
        }catch (error) {
            showToast("Ошибка удаления из корзины", 'danger');
        }
    };

    return { addToCart, deleteFromCart,clearCart };
};
