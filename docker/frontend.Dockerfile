FROM node:20-alpine

WORKDIR /app

# We don't copy package files yet because we will initialize the project via volume mount or exec
COPY frontend/package*.json ./
RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
