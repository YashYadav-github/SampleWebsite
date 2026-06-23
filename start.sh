#!/bin/bash

# Clean Canada Local Webhost Launcher
# Designed for macOS

# Clear the screen
clear

echo "=========================================================="
echo "   🇨🇦  WELCOME TO THE CLEAN CANADA LANDING PAGE LAUNCHER   "
echo "=========================================================="
echo ""
echo "Starting local web server using Python on port 8000..."

# Stop any running processes on port 8000 just in case
lsof -t -i:8000 | xargs kill -9 > /dev/null 2>&1

# Run python server in the background
python3 -m http.server 8000 > /dev/null 2>&1 &
SERVER_PID=$!

# Sleep for a second to let the server start up
sleep 1

# Check if background server is still running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Local web server successfully started on port 8000."
    echo "Opening http://localhost:8000 in your web browser..."
    open "http://localhost:8000"
    
    echo ""
    echo "=========================================================="
    echo "   Web Server PID: $SERVER_PID                            "
    echo "   To STOP the server, press [Ctrl + C] in this window.   "
    echo "=========================================================="
    echo ""
    
    # Wait for Ctrl+C to clean up
    trap "kill -9 $SERVER_PID; echo -e '\nStopping local web server. Goodbye!'; exit 0" INT
    wait $SERVER_PID
else
    echo "❌ Error starting the web server. Please check if port 8000 is already in use."
    exit 1
fi
