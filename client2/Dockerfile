# 1. Base image
FROM node:18-alpine

# 2. Set working directory inside container
WORKDIR /app/client2

# 3. Copy dependency files first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy rest of the app
COPY . .

# 6. Expose Next.js port
EXPOSE 3000

# 7. Run Next.js
CMD ["npm", "run", "dev"]
