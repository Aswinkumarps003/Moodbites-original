FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*

# Environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=4010

WORKDIR /app

COPY requirements.txt .

# Install CPU-only PyTorch + torchvision first
RUN pip install torch==2.0.0+cpu torchvision==0.15.0+cpu --index-url https://download.pytorch.org/whl/cpu

# Install remaining dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Setup uploads
RUN mkdir -p /app/uploads
RUN chmod -R 777 /app/uploads

# Copy app and model
COPY best.pt .
COPY app.py .
COPY index.html .

EXPOSE 4010

CMD gunicorn --bind 0.0.0.0:$PORT --timeout 120 app:app
