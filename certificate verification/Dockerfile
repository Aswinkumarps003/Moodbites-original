FROM python:3.11-slim

# Set the environment flag
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Copy dependency definition file
COPY requirements.txt .

# Install Poppler (for PDF) and Python dependencies (including Gunicorn and Flask-CORS)
RUN apt-get update \
    && apt-get install -y poppler-utils tesseract-ocr \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install gunicorn flask-cors

# Copy the application source code into the container
COPY . .

# Expose the port (Render will override this, but it's good practice)
EXPOSE 5001

# FIX 1 & 4: Use Gunicorn to run the app object. 
# --bind 0.0.0.0:5001: Listens on the fixed port. Render maps this internally.
# --timeout 120: Gives 2 minutes for long OCR/PDF conversion.
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "--timeout", "120", "ocr_service:app"]