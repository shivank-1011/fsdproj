#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Define root directory (assuming the script is triggered from ~ or specifies absolute paths)
APP_DIR="/home/ubuntu/fsdproj"
echo "Starting idempotent deployment at $APP_DIR"

# Check if Node.js & NPM are installed; if not, install them
if ! command -v npm &> /dev/null; then
    echo "NPM not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Idempotently check and install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing pm2 globally..."
    # Warning: Ensure the user running this has proper permissions or avoid sudo if using nvm
    sudo npm install -g pm2
fi

# ---------- SERVER DEPLOYMENT ----------
echo "Setting up server..."
cd "$APP_DIR/server" || exit 1

# Install only production dependencies idempotently (cleans node_modules, installs exact tree)
npm ci --production --quiet

# Restart or Start the server using PM2
if pm2 show fsd-server > /dev/null; then
    echo "Restarting existing PM2 process 'fsd-server'..."
    pm2 restart fsd-server
else
    echo "Starting new PM2 process 'fsd-server'..."
    pm2 start index.js --name "fsd-server"
fi

# ---------- CLIENT DEPLOYMENT ----------
echo "Setting up client..."
cd "$APP_DIR/client" || exit 1

# If utilizing a static PM2 server for a built react client (SPA):
# The built artifacts (dist folder) will be prepared and synced via CI before running this script
if pm2 show fsd-client > /dev/null; then
    echo "Restarting existing PM2 process 'fsd-client'..."
    pm2 restart fsd-client
else
    echo "Starting new static PM2 process 'fsd-client'..."
    pm2 serve dist 5173 --name "fsd-client" --spa
fi

# Save PM2 process list to resurrect across reboots idempotently
pm2 save

echo "Deployment finished successfully."
