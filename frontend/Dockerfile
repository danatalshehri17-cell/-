# --- Stage 1: Build the React Application ---
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
# and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# --- Stage 2: Serve the Static Files with Nginx ---
FROM nginx:stable-alpine AS production

# Copy the built files from the 'build' stage into Nginx's HTML directory
COPY --from=build /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy a custom Nginx configuration file (which you need to create)
# to handle things like routing (React Router)
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 (Nginx default)
EXPOSE 80

# The default command runs Nginx
CMD ["nginx", "-g", "daemon off;"]