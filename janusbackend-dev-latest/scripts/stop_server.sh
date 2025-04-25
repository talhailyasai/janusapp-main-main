#!/bin/bash
echo " Stopping the Server"

cd /var/www/html/janus-backend/
npm install  pm2
pm2 delete all
exit  0



