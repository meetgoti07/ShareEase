FROM node:20

WORKDIR /code/

COPY package*.json .
RUN npm install


COPY vite.config.ts .
COPY tsconfig.json .
COPY index.html .
COPY components.json .
COPY tailwind.config.js .
COPY postcss.config.js .
COPY ../.env .

COPY tsconfig.app.json .
COPY tsconfig.node.json .

COPY ./src ./src
COPY ./public ./public

EXPOSE 3000

CMD ["npm", "run", "dev"]