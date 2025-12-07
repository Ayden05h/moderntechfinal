# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Build the production version
RUN npm run build

# Use a lightweight web server to serve static files
RUN npm install -g serve

# Start the app on port 3000
CMD ["serve", "-s", "build", "-l", "3000"]
