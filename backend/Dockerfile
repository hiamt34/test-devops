FROM node:20.19.0-alpine

WORKDIR /backend/app

RUN apk add --no-cache bash
ADD https://raw.githubusercontent.com/vishnubob/wait-for-it/master/wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm build

EXPOSE 3000

CMD ["/bin/bash", "-c", "/wait-for-it.sh db:5432 -- pnpm db:migrate && pnpm start:prod"]