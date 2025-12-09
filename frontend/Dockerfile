# Node image for building React app
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build React app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Use the PORT Cloud Run provides
ENV PORT 8080

# Start the static server on $PORT
CMD ["serve", "-s", "build", "-l", "8080"]
