
import { addToBasket, deleteFromBasket } from '../https/basketAPI';

export const addToCart = async (user, item, basket) => {
    try {
      const data = await addToBasket(user.user.id, item.id, basket.page, basket.limit);
      if (data) {
        basket.setBasketItems(data.rows);
        basket.setTotalCount(data.count);
      }
    } catch (error) {
      console.error("Ошибка добавления в корзину:", error.response?.data || error.message);
    }
  };
  
  export const deleteFromCart = async (user, item, basket, toClear = 0) => {
    try {
      const data = await deleteFromBasket(user.user.id, item.id, basket.page, basket.limit, toClear);
      if (data) {
        basket.setBasketItems(data.rows);
        basket.setTotalCount(data.count);
      }
    } catch (error) {
      console.error("Ошибка удаления:", error.response?.data || error.message);
    }
  };
  