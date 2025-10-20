# Use the full Python image for better compatibility with ML libraries
FROM python:3.11

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app.py .

# Expose the port Render expects
EXPOSE 8000

# Let Render inject the $PORT variable
CMD uvicorn app:app --host 0.0.0.0 --port $PORT
