#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Installing the latest version of poetry..."
pip install --upgrade pip
pip install poetry==1.5.1

rm poetry.lock
/opt/render/.local/bin/poetry lock
python -m poetry install
