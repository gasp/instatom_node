#!/usr/bin/env bash
# instead of npm start
pm2 start bin/www --name instatom
pm2 list
pm2 logs
