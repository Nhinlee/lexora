#!/bin/bash
set -e

# Ensure we are in the project root
# If the script is run from apps/, move up one level
if [[ $(basename "$PWD") == "apps" ]]; then
  cd ..
fi

# Configuration - Update these to match your Lightsail service names
API_SERVICE_NAME="lexora-api"
WEB_SERVICE_NAME="lexora-web"

# Get latest tag or default to latest
TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "latest")
echo "Building version: $TAG"

# Build API
echo "----------------------------------------"
echo "Building API (lexora-api:$TAG) for linux/amd64..."
echo "----------------------------------------"
docker build --platform linux/amd64 -t lexora-api:$TAG -f apps/api/Dockerfile apps/api

# Build Web
echo "----------------------------------------"
echo "Building Web (lexora-web:$TAG) for linux/amd64..."
echo "----------------------------------------"
docker build --platform linux/amd64 -t lexora-web:$TAG -f apps/web/Dockerfile apps/web

echo "----------------------------------------"
echo "Build complete!"
echo "Images:"
echo "  lexora-api:$TAG"
echo "  lexora-web:$TAG"
echo "----------------------------------------"

# Push to AWS Lightsail
echo ""
echo "Pushing to AWS Lightsail..."
echo "----------------------------------------"

# Push API
echo "Pushing API to Lightsail service: $API_SERVICE_NAME..."
aws lightsail push-container-image \
  --service-name "$API_SERVICE_NAME" \
  --label "api-$TAG" \
  --image "lexora-api:$TAG"

# Push Web
echo "Pushing Web to Lightsail service: $WEB_SERVICE_NAME..."
aws lightsail push-container-image \
  --service-name "$WEB_SERVICE_NAME" \
  --label "web-$TAG" \
  --image "lexora-web:$TAG"

echo "----------------------------------------"
echo "Push complete!"
echo "Next steps:"
echo "  1. Update your Lightsail deployment with the new images"
echo "  2. Image labels: api-$TAG, web-$TAG"
echo "----------------------------------------"
