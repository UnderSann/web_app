import axios from "axios";
import errorStore from '../store/ErrorStore';

const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

const $authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
};
$authHost.interceptors.request.use($authInterceptor);

// Глобальный перехват ошибок
// Добавьте проверку в responseErrorInterceptor
const responseErrorInterceptor = error => {
    if (error.response) {
        const { status, data } = error.response;
        let message = "Неизвестная ошибка";
        if (data && data.message) {
            message = data.message;
        }
        // Обновляем ошибку только если она изменилась
        if (errorStore.errorCode !== status || errorStore.errorMessage !== message) {
            if(status==333 ||status==401){
                errorStore.setErrorLight(message);
            }else{
                errorStore.setErrorCode(status);
                errorStore.setErrorMessage(message);
            }
        }
    } else {
        if (errorStore.errorCode !== 500 || errorStore.errorMessage !== 'Произошла ошибка на сервере') {
            errorStore.setErrorCode(500);
            errorStore.setErrorMessage('Произошла ошибка на сервере');
        }
    }
    return Promise.reject(error);
};



$host.interceptors.response.use(response => response, responseErrorInterceptor);
$authHost.interceptors.response.use(response => response, responseErrorInterceptor);


export {
    $host,
    $authHost
};
