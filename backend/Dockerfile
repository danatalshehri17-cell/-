# Use a Python base image
FROM python:3.11-slim

# Set environment variables for non-interactive commands
ENV PYTHONUNBUFFERED=1

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies (e.g., for PostgreSQL client)
RUN apt-get update \
    && apt-get install -y postgresql-client build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Collect static files (optional, depending on your setup)
RUN python manage.py collectstatic --no-input

# Expose the port Gunicorn will listen on
EXPOSE 8000

# Run the application using Gunicorn (correct project name is 'core')
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
