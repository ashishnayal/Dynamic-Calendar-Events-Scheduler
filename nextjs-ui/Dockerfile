FROM node:20-alpine

WORKDIR /app

# Copy dependency definitions
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
