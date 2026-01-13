#!/bin/bash
set -e

# Install build dependencies
pip install --upgrade pip
pip install wheel setuptools

# Install psycopg2 build dependencies
sudo apt-get update || true
sudo apt-get install -y libpq-dev || true

# Install requirements
pip install -r requirements.txt

# Collect static files
python backend/manage.py collectstatic --noinput
