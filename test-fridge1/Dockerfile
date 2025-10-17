# Use an official Python runtime with a smaller footprint
FROM python:3.11-slim

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=4010

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definition file
# This is CRITICAL for model services, as it defines the ML libraries
COPY requirements.txt .

# Install Python dependencies (this will install libraries like PyTorch or YOLO dependencies)
# Use pip install before copying app code and model
RUN pip install --no-cache-dir -r requirements.txt

# --- Setup for uploads/temporary files ---
# Create the uploads directory explicitly where the app will save data.
RUN mkdir -p /app/uploads
RUN chmod -R 777 /app/uploads

# Copy the application code, model file, and HTML
# The model file is large, so ensure it is copied correctly
COPY best.pt .
COPY app.py .
COPY index.html . 

# Expose the port the application listens on (Set to 4010)
EXPOSE 4010

# Define the command to run the main application file (assuming app.py starts the server)
# Use 'python -u' for unbuffered output, which is useful in containers
CMD ["python", "app.py"]
