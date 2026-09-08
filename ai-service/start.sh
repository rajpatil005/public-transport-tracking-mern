#!/bin/bash
echo "Starting Kolhapur AI Service..."
echo "Environment: $ENVIRONMENT"
echo "Backend URL: $BACKEND_URL"

# Check if GOOGLE_API_KEY is set
if [ -z "$GOOGLE_API_KEY" ]; then
    echo "WARNING: GOOGLE_API_KEY is not set!"
fi

# Start the application
uvicorn main:app --host 0.0.0.0 --port $PORT