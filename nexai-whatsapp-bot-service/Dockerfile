FROM node:20-alpine

WORKDIR /app
RUN apk add --no-cache git python3 make g++

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

ENV NODE_ENV=production
ENV PORT=3002

EXPOSE 3002
CMD ["node", "baileys-bot.js"]
