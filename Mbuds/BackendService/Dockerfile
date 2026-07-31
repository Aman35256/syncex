FROM node:20-alpine

WORKDIR /app

COPY package*.json ./


RUN npm ci --omit=dev


COPY . .
RUN sed -i 's/\r$//' ./entrypoint.sh \
    && chmod +x entrypoint.sh

ENV NODE_ENV=production

EXPOSE 8088

ENTRYPOINT ["./entrypoint.sh"]