# Use Nginx as the base image
FROM nginx:alpine

# Copy the built files from the local dist directory to the Nginx web server directory
COPY ./dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
