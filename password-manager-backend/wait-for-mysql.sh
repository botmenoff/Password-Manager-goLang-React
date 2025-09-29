#!/bin/sh
# Esperar a que MySQL esté listo
echo "Waiting for MySQL..."
while ! nc -z -v -w30 $BLUEPRINT_DB_HOST $BLUEPRINT_DB_PORT
do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo "MySQL is up - running migrations..."
./migrate up

echo "Starting backend..."
./main
