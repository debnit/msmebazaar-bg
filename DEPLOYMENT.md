# Deployment Guide

This guide covers deployment strategies for the MSME Bazaar platform across different environments.

## 🚀 Quick Deployment with Docker Compose

### Prerequisites
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 7+

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://msmebazaar:password@localhost:5432/msmebazaar"
POSTGRES_PASSWORD=password

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"

# Redis
REDIS_URL="redis://localhost:6379"

# External Services
SENDGRID_API_KEY="your-sendgrid-key"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="msmebazaar-assets"

# Monitoring
GRAFANA_PASSWORD=admin

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_NOTIFICATIONS=true
```

### 2. Start the Platform

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Database Migrations

```bash
# Run migrations for all services
docker-compose exec auth-service npx prisma migrate deploy
docker-compose exec loan-service npx prisma migrate deploy
docker-compose exec buyer-service npx prisma migrate deploy
# ... repeat for other services
```

## ☁️ Cloud Deployment

### AWS Deployment

#### Option 1: ECS with Fargate

1. **Create ECS Cluster**
```bash
aws ecs create-cluster --cluster-name msmebazaar-cluster
```

2. **Create Task Definitions**
```yaml
# task-definition.json
{
  "family": "msmebazaar-frontend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "frontend",
      "image": "your-registry/frontend:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ]
    }
  ]
}
```

3. **Create Service**
```bash
aws ecs create-service \
  --cluster msmebazaar-cluster \
  --service-name frontend-service \
  --task-definition msmebazaar-frontend:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

#### Option 2: EKS (Kubernetes)

1. **Create EKS Cluster**
```bash
eksctl create cluster \
  --name msmebazaar-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 3 \
  --nodes-min 1 \
  --nodes-max 4
```

2. **Deploy with Helm**
```bash
# Install Helm chart
helm install msmebazaar ./helm-charts/msmebazaar \
  --set environment=production \
  --set database.url=$DATABASE_URL \
  --set jwt.secret=$JWT_SECRET
```

### Google Cloud Platform (GCP)

#### Option 1: Google Kubernetes Engine (GKE)

1. **Create GKE Cluster**
```bash
gcloud container clusters create msmebazaar-cluster \
  --zone us-central1-a \
  --num-nodes 3 \
  --machine-type e2-medium
```

2. **Deploy Services**
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/database.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/frontend.yaml
```

#### Option 2: Cloud Run

```bash
# Deploy frontend
gcloud run deploy msmebazaar-frontend \
  --source ./frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy API gateway
gcloud run deploy msmebazaar-api-gateway \
  --source ./api-gateway \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Railway Deployment

1. **Connect Repository**
   - Link your GitHub repository to Railway
   - Configure environment variables

2. **Deploy Services**
```bash
# Deploy each service
railway up --service frontend
railway up --service api-gateway
railway up --service auth-service
# ... repeat for other services
```

## 🐳 Kubernetes Manifests

### Namespace
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: msmebazaar
```

### Database
```yaml
# k8s/database.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: msmebazaar
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14-alpine
        env:
        - name: POSTGRES_DB
          value: msmebazaar
        - name: POSTGRES_USER
          value: msmebazaar
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: msmebazaar
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432
```

### Frontend Deployment
```yaml
# k8s/frontend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: msmebazaar
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-registry/frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: production
        - name: NEXT_PUBLIC_API_URL
          value: http://api-gateway:3001
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: msmebazaar
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

## 🔧 Environment-Specific Configurations

### Development
```bash
# .env.development
NODE_ENV=development
DATABASE_URL="postgresql://localhost:5432/msmebazaar_dev"
LOG_LEVEL=debug
ENABLE_SWAGGER=true
```

### Staging
```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL="postgresql://staging-db:5432/msmebazaar_staging"
LOG_LEVEL=info
ENABLE_ANALYTICS=false
```

### Production
```bash
# .env.production
NODE_ENV=production
DATABASE_URL="postgresql://prod-db:5432/msmebazaar_prod"
LOG_LEVEL=warn
ENABLE_ANALYTICS=true
ENABLE_MONITORING=true
```

## 📊 Monitoring & Observability

### Prometheus Configuration
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'msmebazaar-services'
    static_configs:
      - targets: ['auth-service:3002', 'loan-service:3003', 'buyer-service:3004']
    metrics_path: /metrics
    scrape_interval: 5s
```

### Grafana Dashboards
- Import dashboards from `monitoring/grafana/dashboards/`
- Configure data sources in `monitoring/grafana/datasources/`

### Health Checks
```bash
# Check service health
curl http://localhost/health

# Check individual services
curl http://auth-service:3002/health
curl http://loan-service:3003/health
```

## 🔒 Security Considerations

### SSL/TLS Configuration
```nginx
# nginx/ssl.conf
ssl_certificate /etc/nginx/ssl/cert.pem;
ssl_certificate_key /etc/nginx/ssl/key.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
```

### Secrets Management
```bash
# Use Kubernetes secrets
kubectl create secret generic db-secret \
  --from-literal=password=your-secure-password

# Use Docker secrets (Swarm mode)
echo "your-secure-password" | docker secret create db_password -
```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Issues**
```bash
# Check database connectivity
docker-compose exec postgres psql -U msmebazaar -d msmebazaar -c "SELECT 1;"
```

2. **Service Health Checks**
```bash
# Check service logs
docker-compose logs service-name

# Check Kubernetes pods
kubectl get pods -n msmebazaar
kubectl describe pod pod-name -n msmebazaar
```

3. **Memory Issues**
```bash
# Monitor resource usage
docker stats
kubectl top pods -n msmebazaar
```

### Rollback Procedures
```bash
# Docker Compose rollback
docker-compose down
docker-compose up -d --force-recreate

# Kubernetes rollback
kubectl rollout undo deployment/frontend -n msmebazaar
```

## 📈 Scaling Strategies

### Horizontal Pod Autoscaling (Kubernetes)
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
  namespace: msmebazaar
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Load Balancer Configuration
```yaml
# Configure load balancer for high availability
apiVersion: v1
kind: Service
metadata:
  name: frontend-lb
  annotations:
    service.beta.kubernetes.io/aws-load-balancer-type: nlb
    service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
spec:
  type: LoadBalancer
  ports:
  - port: 80
    targetPort: 3000
  selector:
    app: frontend
```

