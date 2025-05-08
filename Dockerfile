# filepath: c:\Users\ahmed\OneDrive\Desktop\UNI\UNI\Dockerfile
FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]