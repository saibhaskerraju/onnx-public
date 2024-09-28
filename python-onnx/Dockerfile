# Use an official Python runtime as a parent image
FROM python:3.9-slim AS dev

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

# Install virtualenv
RUN pip install --no-cache-dir virtualenv

# Create a virtual environment
RUN virtualenv venv

# Activate the virtual environment and install dependencies
RUN . /app/venv/bin/activate && pip install --no-cache-dir -r /app/requirements.txt

# Ensure the virtual environment's bin directory is in the PATH
ENV PATH="/app/venv/bin:$PATH"

# Copy the rest of the application code
COPY . /app

CMD ["python","--version"]