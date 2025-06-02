#!/usr/bin/env bash
set -e

# Set PYTHONPATH
export PYTHONPATH="$PWD:$PYTHONPATH"

# Clean Python caches
find . -type d -name "__pycache__" -exec rm -rf {} +
find . -type d -name ".pytest_cache" -exec rm -rf {} +

# Run tests
echo "Running tests..."
pytest tests/ -v 