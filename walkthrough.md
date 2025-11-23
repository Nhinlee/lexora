# AWS Lightsail Deployment Guide (CLI Edition)

This guide provides a complete, step-by-step workflow to deploy the **Lexora** stack (Postgres DB, NestJS API, Next.js Web) using **AWS CLI**.

## Prerequisites
- AWS CLI installed and configured (`aws configure`).
- Lightsail Control Plugin installed (for `push-container-image`).
- Docker running.

---

## Phase 1: Create the Database (Postgres)

First, we create a managed Postgres database to ensure data persistence.

```bash
# 1. Create the database (Cost: ~$15/mo for Micro)
aws lightsail create-relational-database \
    --relational-database-name lexora-db \
    --relational-database-blueprint-id postgres_18 \
    --relational-database-bundle-id micro_2_0 \
    --master-database-name lexora \
    --master-username dbadmin

# 2. Wait for it to be 'available' (this takes a few minutes)
aws lightsail get-relational-database --relational-database-name lexora-db

# 3. Get the connection details (Host, Port, Password)
aws lightsail get-relational-database-master-user-password \
    --relational-database-name lexora-db
```

> **Note**: Construct your `DATABASE_URL` using the output:
> `postgresql://dbadmin:<PASSWORD>@<HOST>:5432/lexora?schema=public&sslmode=require`

---

## Phase 2: Deploy the API Service

We deploy the API first because the Web app needs the API's URL.

```bash
# 1. Create the Container Service (Cost: ~$7-10/mo)
aws lightsail create-container-service \
    --service-name lexora-api \
    --power small \
    --scale 1

# 2. Build and Push the Docker Image (Targeting linux/amd64)
# IMPORTANT: We must build for linux/amd64 for AWS Lightsail, even if you are on a Mac (M1/M2).
docker build --platform linux/amd64 -t lexora-api ./apps/api
aws lightsail push-container-image \
    --service-name lexora-api \
    --label api \
    --image lexora-api

# 3. Create the Deployment (Replace placeholders!)
# Note: You must replace <IMAGE_NAME> with the full image string returned from the push command (e.g., :lexora-api.api.1)
aws lightsail create-container-service-deployment \
    --service-name lexora-api \
    --containers '{
        "api": {
            "image": "lexora-api.api.1",
            "ports": {"3000": "HTTP"},
            "environment": {
                "DATABASE_URL": "...",
                "AWS_ACCESS_KEY_ID": "...",
                "AWS_SECRET_ACCESS_KEY": "...",
                "AWS_REGION": "...",
                "SERPER_API_KEY": "..."
            }
        }
    }' \
    --public-endpoint '{"containerName": "api", "containerPort": 3000, "healthCheck": {"path": "/"}}'
```

**Wait** until the service state is `RUNNING`. Then get the public URL:
```bash
aws lightsail get-container-services --service-name lexora-api
# Copy the 'url' field from the output (e.g., https://lexora-api...lightsail.com)
```

---

## Phase 3: Deploy the Web Service

Now we deploy the Web app, pointing it to the API.

```bash
# 1. Create the Container Service (Cost: ~$7-10/mo)
aws lightsail create-container-service \
    --service-name lexora-web \
    --power small \
    --scale 1

# 2. Build and Push the Docker Image (Targeting linux/amd64)
docker build --platform linux/amd64 -t lexora-web ./apps/web
aws lightsail push-container-image \
    --service-name lexora-web \
    --label web \
    --image lexora-web

# 3. Create the Deployment
# Replace <API_PUBLIC_URL> with the URL from Phase 2
aws lightsail create-container-service-deployment \
    --service-name lexora-web \
    --containers '{
        "web": {
            "image": "<YOUR_PUSHED_IMAGE_NAME>",
            "ports": {"3000": "HTTP"},
            "environment": {
                "API_URL": "<API_PUBLIC_URL>"
            }
        }
    }' \
    --public-endpoint '{"containerName": "web", "containerPort": 3000, "healthCheck": {"path": "/"}}'
```

---

## Verification

1.  Visit the **Web Service URL**.
2.  Try to upload a book page.
3.  If it works, the Web app is successfully talking to the API, which is talking to the Database!
