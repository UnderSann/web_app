# 🧶 Онлайн-магазин вязаных сумок

Этот проект — полноценный сайт для ремесленника, продающего вязаные сумки. Система включает клиентскую и серверную части, реализованные на стеке **React**, **MobX**, **Node.js**, **Express**, **PostgreSQL**, с поддержкой загрузки изображений, авторизации, админки и оформления заказов.

---

## 🚀 Возможности

- Регистрация и вход пользователей
- Панель администратора (добавление товаров, просмотр заказов)
- Списки изделий с полноэкранным просмотром
- Корзина с оформлением заказа
- Волидация по номеру телефона
- Простой и адаптивный дизайн для телефона
- Анимация вкладок, сообщения, валидация номера
- Личный кабинет заказов
---

## ⚙️ Технологии

### Backend

- `express`, `sequelize`, `pg` — сервер и база данных
- `jsonwebtoken`, `bcrypt` — авторизация
- `express-fileupload` — загрузка изображений
- `dotenv` — конфигурация
- `ws` — поддержка WebSocket (опционально)
- `libphonenumber-js` — валидация номера

### Frontend

- `react`, `react-router-dom`, `axios`
- `mobx`, `mobx-react-lite` — управление состоянием
- `react-bootstrap`, `bootstrap` — стилизация
- `framer-motion`, `react-transition-group` — анимации
- `lucide-react` — иконки
- `react-phone-number-input` — поле ввода номера

---

## 🧩 Структура проекта

### 📦 client ###

#### `public/`
- `index.html` — шаблон главной страницы
- `.env` — переменные окружения
- 
#### `src/`
##### `App.js`, `index.js`, `routes.js`
- Точка входа, роутинг приложения

##### `components/`
Компоненты интерфейса:
- `NavBar.js` — верхняя панель навигации
- `ItemsList.js`, `ItemsMain.js`, `ItemPreveiw.js`, `ItemPreveiw2.js` — отображение товаров
- `OrderModal.js` — модальное окно заказа
- `OrdersAdministration.js` — управление заказами (для админа)
- `CartTrashButton.js` — удаление из корзины, добавлению в карзинц
- `Loading.js`, `UpWindowMessage.js` — UX-компоненты
- `Pages.js` — пагинация

##### `ErrorHandlers/`
- `ErrorBoundary.js`, `ErrorPage.js` — обработка ошибок на фронте

##### `https/`
Обёртки над API:
- `userAPI.js`, `itemAPI.js`, `orderAPI.js`, `basketAPI.js`

##### `pages/`
Страницы сайта:
- `Shop.js` — магазин (главная)
- `Auth.js` — вход/регистрация
- `Basket.js` — корзина
- `ItemPage.js` — детальный просмотр товара
- `Orders.js` —  страница отображения заказов
- `Admin.js` — Админ-панель

##### `scripts/`
- `basketScr.js` — логика корзины

##### `store/`
MobX-хранилища:
- `UserStore.js`, `BasketStore.js`, `OrderStore.js` и др.

##### `styles/`
CSS-файлы для отдельных элементов и анимаций:
- `OrderTabsAnimation.css`, `popup.css`, `colorSelector.css`, и др.

##### `utils/`
- `consts.js` — константы (пути)

---

### 🛠 server ###

#### Корень
- `index.js` — запуск сервера
- `db.js` — подключение к базе
- `.env` — переменные окружения

#### `controllers/`
Обработка логики запросов:
- `userController.js`, `itemController.js`, `orderController.js` и т.д.

#### `middleware/`
- `authMiddleware.js`, `checkRoleMiddleware.js` — защита маршрутов
- `ErrorHandlingMiddleware.js` — глобальный обработчик ошибок

#### `models/`
- `models.js` — все Sequelize-модели: User, Item, Order и др.

#### `routes/`
Маршруты:
- `userRouter.js`, `itemRouter.js`, `orderRouter.js`, `basketRouter.js` и др.

#### `error/`
- `ApiError.js` — кастомный класс ошибок

---
