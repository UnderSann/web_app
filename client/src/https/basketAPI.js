
import { $authHost,$host } from ".";


export const addToBasket = async (userId,itemId,page, limit=1) =>{
    const {data} = await $authHost.post('api/basket/', {userId,itemId,page,limit})
    return data
}

export const fetchBasket = async (userId,page=1,limit=1) =>{
    const {data} = await $authHost.get(`api/basket/${userId}`,{params:{
        page, limit
    }})
    return data
}
export const fetchOneBasket = async (userId,itemId) =>{
    const {data} = await $authHost.get(`api/basket/${userId}/${itemId}`)
    return data
}

export const deleteFromBasket = async (userId, itemId, page, limit = 10, toClear) => {
    const { data } = await $authHost.delete(`api/basket/remove`, {
        data: { userId, itemId, page, limit,toClear } 
    });
    return data;
};

export const clearBasket = async (userId) => {
    const { data } = await $authHost.delete(`api/basket/clear`, {
        data: {userId} 
    });
    return data;
};