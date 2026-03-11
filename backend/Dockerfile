FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 120000 \
 && npm ci

COPY . .

RUN mkdir -p generated

EXPOSE 3000

CMD ["sh","-c","npx prisma db push && npx prisma generate && npm run dev"]