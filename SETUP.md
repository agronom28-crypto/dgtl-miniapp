# Быстрый запуск на новом компьютере

## Требования
- Node.js
- MongoDB (запущен на localhost:27017)

## 1. Клонировать
git clone https://github.com/agronom28-crypto/dgtl-miniapp.git
cd dgtl-miniapp

## 2. Server (терминал 1)
cd server
npm install
Создать server/.env с содержимым:
MONGO_URI=mongodb://localhost:27017/dgtl_miniapp
PORT=5001

Затем:
node seedAll.js
npm run dev

## 3. Client (терминал 2)
cd client
npm install
Создать client/.env.local с содержимым:
MONGODB_URI=mongodb://localhost:27017/dgtl_miniapp
NEXTAUTH_SECRET=dgtl-dev-secret-2026
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5001
SERVER_URL=http://localhost:5001

Затем:
npm run dev

## 4. Открыть http://localhost:3000

## Синхронизация
- Уходишь: git add . && git commit -m "описание" && git push origin master
- Приходишь: git pull origin master && cd server && node seedAll.js
