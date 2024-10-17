#!/bin/bash

IP=$1

if [ -z "$IP" ]; then
  echo "Usage: $0 <IP_ADDRESS>"
  exit 1
fi

find ./frontend/js/ -type f -name "*.js" -exec sed -i "s/microserivces_book/$IP/g" {} +
