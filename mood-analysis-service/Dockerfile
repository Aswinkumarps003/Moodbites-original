# Use the full Python image for better compatibility with ML libraries (transformers, torch)
FROM python:3.11

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV HOST=0.0.0.0

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definition file (CRITICAL)
# This assumes you have a requirements.txt file in the mood-analysis-service folder
COPY requirements.txt .

# Install Python dependencies
# NOTE: The Hugging Face model requires PyTorch (torch) and transformers.
# We are assuming these are in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code (app.py is the main file)
COPY app.py .
# The other files (index.js, server.js) are not used by the python app, but we can leave the COPY commands for completeness 
# as per the original folder structure, though they are redundant here.
COPY index.js .
COPY server.js .

# Expose the port the application listens on (Set to 8000, matching the uvicorn run command)
EXPOSE 8000

# Define the command to run the main application file using uvicorn
# The command must target the 'app' FastAPI instance inside the 'app.py' file.
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
