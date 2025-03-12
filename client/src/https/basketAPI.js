
import { $authHost,$host } from ".";


export const addToBasket = async (userId,itemId) =>{
    const {data} = await $authHost.post('api/basket/', {userId,itemId})
    return data
}

export const fetchBasket = async (userId,page, limit=1) =>{
    const {data} = await $host.get(`api/basket/${userId}`,{params:{
        page, limit
    }})
    return data
}

export const deleteFromBasket = async (userId, itemId, page, limit = 10) => {
    const { data } = await $host.delete(`api/basket/remove`, {
        data: { userId, itemId, page, limit } 
    });
    return data;
};
