FROM node:18

WORKDIR /app

COPY . .

RUN npm install


CMD ["sh", "-c", "npx prisma generate && npm run production"]