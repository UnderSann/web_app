import  errorStore  from '../store/ErrorStore';

class WebSocketAPI {
    constructor(url=process.env.REACT_APP_WEBSOCKET_URL) {
        this.url = url;
        this.socket = null;
    }

    connect() {
        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                console.log('WebSocket connection established');
            };

            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                errorStore.setErrorCode(500);
                errorStore.setErrorMessage('Ошибка подключения к веб-сокету');
            };

            this.socket.onclose = () => {
                console.log('WebSocket connection closed');
            };
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.error('WebSocket connection is not open');
        }
    }

    onMessage(callback) {
        if (this.socket) {
            this.socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                callback(data);
            };
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

export const webSocketAPI = new WebSocketAPI(process.env.REACT_APP_WEBSOCKET_URL);