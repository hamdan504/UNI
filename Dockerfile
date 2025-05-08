FROM node:20

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies and rebuild if needed
RUN npm install && npm rebuild

# Copy application files
COPY . .

# Create required directories
RUN mkdir -p uploads_act uploads_notes uploads_emploi

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]