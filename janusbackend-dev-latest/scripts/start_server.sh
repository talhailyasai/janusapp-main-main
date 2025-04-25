#!/bin/bash

echo " Starting the Backend Server"

cd /var/www/html/janus-backend/

pm2 start "npm start"

