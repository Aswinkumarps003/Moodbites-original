# Use an official Python runtime as the parent image
FROM python:3.11-slim

# Set the environment flag
ENV PYTHONUNBUFFERED=1
ENV PORT=5001

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definition file
# Assumes requirements.txt is in the 'certificate verification' folder
COPY requirements.txt .

# Install Python dependencies (this is the build step)
# Use the correct dependency file for Python
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code into the container
# This copies ocr_service.py and any supporting files
COPY . .

# Expose the port (Updated to 5001 for the Certificate Verification Service)
EXPOSE 5001 

# Define the command to run the main application file
# Assuming your service is run directly via python and listens on 0.0.0.0
CMD ["python", "ocr_service.py"]
