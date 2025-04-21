Требуется создать PostgreSQL базу данных и заполнить .env 
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=you_db
DB_PASSWORD=you_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret

cd esoftTestApp/server
npm run dev
cd esoftTestApp/client
npm run dev
