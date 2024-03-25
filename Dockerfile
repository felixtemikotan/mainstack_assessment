FROM node:gallium-alpine

ENV NODE_ENV=production
ENV PORT=4000

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm i

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
