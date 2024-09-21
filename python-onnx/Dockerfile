# Use an official Python runtime as a parent image
FROM python:3.9-slim AS dev

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /workspace
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python packages
RUN pip install --no-cache-dir -r /app/requirements.txt

CMD ["python","--version"]