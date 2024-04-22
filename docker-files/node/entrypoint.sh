#!/bin/sh

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Default port setup
APP_PORT=${PORT:-3000}

# Define the root directory of your Node application
APP_ROOT="/usr/src/app"

echo "Starting the Express application..."
if [ "$APP_ENV" = "local" ]; then
  echo "${GREEN}Running in Development Mode${NC}"
  # Explicitly install devDependencies in case they were missed
  npm install --only=development
  npm run dev
else
  echo "${GREEN}Running in Production Mode${NC}"
  # Building the application
  echo "Building the application..."
  npm run build

  # Starting the application
  echo "Starting the production server..."
  PORT=$APP_PORT npm start
fi
