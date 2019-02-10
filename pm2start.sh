#!/usr/bin/env bash
# instead of npm start
pm2 start app.js --name instatom --watch
pm2 list
pm2 logs
