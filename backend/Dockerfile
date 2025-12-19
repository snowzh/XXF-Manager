# Use Python 3.9 as the base image
FROM python:3.9

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file to the container
COPY requirements.txt .

# Install the required dependencies
RUN pip install -r requirements.txt

# Copy the entire backend directory to the container
COPY . .

# Expose port 8000 for the Django application
EXPOSE 8000

# Set Python path
ENV PYTHONPATH=/app

# Run the Django application
CMD ["python", "xxf_manager/manage.py", "runserver", "0.0.0.0:8000"]
