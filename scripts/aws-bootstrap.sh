#!/bin/bash
# =============================================================================
# fsdproj AWS Bootstrap Script
# One-time setup: creates all AWS infrastructure for ECR + ECS deployment
#
# Prerequisites:
#   - AWS CLI v2 installed and configured (aws configure)
#   - IAM user with AdministratorAccess (or specific ECR+ECS+IAM permissions)
#
# Usage:
#   chmod +x scripts/aws-bootstrap.sh
#   ./scripts/aws-bootstrap.sh
# =============================================================================

set -e

# ── Configuration ──────────────────────────────────────────────────────────────
AWS_REGION="eu-north-1"
CLUSTER_NAME="fsdproj-cluster"
ECR_REPO_SERVER="fsdproj-server"
ECR_REPO_CLIENT="fsdproj-client"
TASK_DEF_SERVER="fsdproj-server-task"
TASK_DEF_CLIENT="fsdproj-client-task"
SERVICE_SERVER="fsdproj-server-service"
SERVICE_CLIENT="fsdproj-client-service"
LOG_GROUP_SERVER="/ecs/fsdproj-server"
LOG_GROUP_CLIENT="/ecs/fsdproj-client"
EXECUTION_ROLE_NAME="ecsTaskExecutionRole"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}  fsdproj AWS Bootstrap — eu-north-1 (Stockholm)${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo ""

# ── Step 0: Validate AWS CLI ────────────────────────────────────────────────
echo -e "${YELLOW}[0/9] Validating AWS CLI setup...${NC}"
if ! command -v aws &>/dev/null; then
    echo -e "${RED}ERROR: AWS CLI not found. Install from https://aws.amazon.com/cli/${NC}"
    exit 1
fi

ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS Account ID: ${ACCOUNT_ID}${NC}"
echo -e "${GREEN}✓ Region: ${AWS_REGION}${NC}"
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# ── Step 1: Create ECR Repositories ─────────────────────────────────────────
echo ""
echo -e "${YELLOW}[1/9] Creating ECR repositories...${NC}"

create_ecr_repo() {
    local repo_name=$1
    if aws ecr describe-repositories --repository-names "$repo_name" --region "$AWS_REGION" &>/dev/null; then
        echo -e "${GREEN}✓ ECR repo '$repo_name' already exists — skipping.${NC}"
    else
        aws ecr create-repository \
            --repository-name "$repo_name" \
            --region "$AWS_REGION" \
            --image-scanning-configuration scanOnPush=true \
            --image-tag-mutability MUTABLE \
            --output text --query "repository.repositoryUri"
        echo -e "${GREEN}✓ Created ECR repo: $repo_name${NC}"
    fi
}

create_ecr_repo "$ECR_REPO_SERVER"
create_ecr_repo "$ECR_REPO_CLIENT"

# ── Step 2: Create CloudWatch Log Groups ─────────────────────────────────────
echo ""
echo -e "${YELLOW}[2/9] Creating CloudWatch log groups...${NC}"

create_log_group() {
    local log_group=$1
    if aws logs describe-log-groups --log-group-name-prefix "$log_group" --region "$AWS_REGION" \
        --query "logGroups[?logGroupName=='$log_group']" --output text | grep -q "$log_group"; then
        echo -e "${GREEN}✓ Log group '$log_group' already exists — skipping.${NC}"
    else
        aws logs create-log-group --log-group-name "$log_group" --region "$AWS_REGION"
        # Set 30-day retention
        aws logs put-retention-policy \
            --log-group-name "$log_group" \
            --retention-in-days 30 \
            --region "$AWS_REGION"
        echo -e "${GREEN}✓ Created log group: $log_group (30-day retention)${NC}"
    fi
}

create_log_group "$LOG_GROUP_SERVER"
create_log_group "$LOG_GROUP_CLIENT"

# ── Step 3: Create IAM Execution Role ────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/9] Creating ECS task execution IAM role...${NC}"

TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ecs-tasks.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}'

if aws iam get-role --role-name "$EXECUTION_ROLE_NAME" &>/dev/null; then
    echo -e "${GREEN}✓ IAM role '$EXECUTION_ROLE_NAME' already exists — skipping.${NC}"
else
    aws iam create-role \
        --role-name "$EXECUTION_ROLE_NAME" \
        --assume-role-policy-document "$TRUST_POLICY" \
        --output text --query "Role.RoleName" > /dev/null
    # Attach managed policies
    aws iam attach-role-policy \
        --role-name "$EXECUTION_ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
    # Allow reading from Secrets Manager
    aws iam attach-role-policy \
        --role-name "$EXECUTION_ROLE_NAME" \
        --policy-arn "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
    echo -e "${GREEN}✓ Created IAM role: $EXECUTION_ROLE_NAME${NC}"
fi

EXECUTION_ROLE_ARN="arn:aws:iam::${ACCOUNT_ID}:role/${EXECUTION_ROLE_NAME}"

# ── Step 4: Store Secrets in AWS Secrets Manager ──────────────────────────────
echo ""
echo -e "${YELLOW}[4/9] Storing application secrets in AWS Secrets Manager...${NC}"
echo -e "${YELLOW}      (Reads from server/.env in current directory)${NC}"

ENV_FILE="$(dirname "$0")/../server/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}ERROR: server/.env not found at $ENV_FILE${NC}"
    echo "Please run this script from the project root or adjust ENV_FILE path."
    exit 1
fi

store_secret() {
    local key=$1
    local value=$2
    local secret_name="fsdproj/${key}"
    if aws secretsmanager describe-secret --secret-id "$secret_name" --region "$AWS_REGION" &>/dev/null; then
        echo -e "${GREEN}✓ Secret '$secret_name' already exists — skipping.${NC}"
    else
        aws secretsmanager create-secret \
            --name "$secret_name" \
            --secret-string "$value" \
            --region "$AWS_REGION" \
            --output text --query "ARN" > /dev/null
        echo -e "${GREEN}✓ Stored secret: $secret_name${NC}"
    fi
}

# Parse server/.env and store each variable
while IFS='=' read -r key value; do
    # Skip comments, blank lines
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    # Strip surrounding quotes from value
    value="${value%\"}"
    value="${value#\"}"
    value="${value%\'}"
    value="${value#\'}"
    # Store meaningful secrets (skip PORT, CLIENT_URL for now — injected differently)
    case "$key" in
        DATABASE_URL|DIRECT_URL|ACCESS_TOKEN_SECRET|REFRESH_TOKEN_SECRET|\
        CLOUDINARY_CLOUD_NAME|CLOUDINARY_API_KEY|CLOUDINARY_API_SECRET|\
        GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET)
            store_secret "$key" "$value"
            ;;
    esac
done < "$ENV_FILE"

# Store CLIENT_URL separately (will point to ECS client service — placeholder for now)
store_secret "CLIENT_URL" "http://REPLACE_WITH_ECS_CLIENT_PUBLIC_IP"

# ── Step 5: Create ECS Cluster ────────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[5/9] Creating ECS Fargate cluster...${NC}"

if aws ecs describe-clusters --clusters "$CLUSTER_NAME" --region "$AWS_REGION" \
    --query "clusters[?clusterName=='$CLUSTER_NAME' && status=='ACTIVE']" \
    --output text | grep -q "$CLUSTER_NAME"; then
    echo -e "${GREEN}✓ ECS cluster '$CLUSTER_NAME' already exists — skipping.${NC}"
else
    aws ecs create-cluster \
        --cluster-name "$CLUSTER_NAME" \
        --capacity-providers FARGATE FARGATE_SPOT \
        --default-capacity-provider-strategy \
            capacityProvider=FARGATE,weight=1,base=1 \
        --region "$AWS_REGION" \
        --output text --query "cluster.clusterName" > /dev/null
    echo -e "${GREEN}✓ Created ECS cluster: $CLUSTER_NAME${NC}"
fi

# ── Step 6: Register Task Definitions ────────────────────────────────────────
echo ""
echo -e "${YELLOW}[6/9] Registering ECS task definitions...${NC}"

SCRIPT_DIR="$(dirname "$0")"

# Replace ACCOUNT_ID placeholder in task definitions
for TASK_FILE in "$SCRIPT_DIR/../ecs/task-definition-server.json" \
                 "$SCRIPT_DIR/../ecs/task-definition-client.json"; do
    sed "s/ACCOUNT_ID/${ACCOUNT_ID}/g" "$TASK_FILE" > /tmp/task-def-rendered.json
    aws ecs register-task-definition \
        --cli-input-json file:///tmp/task-def-rendered.json \
        --region "$AWS_REGION" \
        --output text --query "taskDefinition.taskDefinitionArn" > /dev/null
    echo -e "${GREEN}✓ Registered task definition from: $(basename $TASK_FILE)${NC}"
done

# ── Step 7: Get Default VPC and Subnets ──────────────────────────────────────
echo ""
echo -e "${YELLOW}[7/9] Fetching default VPC and subnets...${NC}"

DEFAULT_VPC=$(aws ec2 describe-vpcs \
    --filters "Name=isDefault,Values=true" \
    --query "Vpcs[0].VpcId" \
    --output text \
    --region "$AWS_REGION")

SUBNETS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$DEFAULT_VPC" \
    --query "Subnets[*].SubnetId" \
    --output text \
    --region "$AWS_REGION" | tr '\t' ',')

echo -e "${GREEN}✓ VPC: $DEFAULT_VPC${NC}"
echo -e "${GREEN}✓ Subnets: $SUBNETS${NC}"

# Create a security group for ECS tasks
SG_NAME="fsdproj-ecs-sg"
EXISTING_SG=$(aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=$SG_NAME" "Name=vpc-id,Values=$DEFAULT_VPC" \
    --query "SecurityGroups[0].GroupId" \
    --output text \
    --region "$AWS_REGION" 2>/dev/null || echo "None")

if [ "$EXISTING_SG" = "None" ] || [ -z "$EXISTING_SG" ]; then
    SG_ID=$(aws ec2 create-security-group \
        --group-name "$SG_NAME" \
        --description "Security group for fsdproj ECS tasks" \
        --vpc-id "$DEFAULT_VPC" \
        --region "$AWS_REGION" \
        --query "GroupId" \
        --output text)
    # Allow inbound traffic on ports 5001 (API) and 80 (client)
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp --port 5001 --cidr 0.0.0.0/0 \
        --region "$AWS_REGION" > /dev/null
    aws ec2 authorize-security-group-ingress \
        --group-id "$SG_ID" \
        --protocol tcp --port 80 --cidr 0.0.0.0/0 \
        --region "$AWS_REGION" > /dev/null
    echo -e "${GREEN}✓ Created security group: $SG_ID${NC}"
else
    SG_ID="$EXISTING_SG"
    echo -e "${GREEN}✓ Security group '$SG_NAME' already exists: $SG_ID${NC}"
fi

# ── Step 8: Create ECS Services ───────────────────────────────────────────────
echo ""
echo -e "${YELLOW}[8/9] Creating ECS Fargate services...${NC}"

create_service() {
    local service_name=$1
    local task_def=$2
    local port=$3

    if aws ecs describe-services \
        --cluster "$CLUSTER_NAME" \
        --services "$service_name" \
        --region "$AWS_REGION" \
        --query "services[?serviceName=='$service_name' && status=='ACTIVE']" \
        --output text | grep -q "$service_name"; then
        echo -e "${GREEN}✓ ECS service '$service_name' already exists — skipping.${NC}"
    else
        aws ecs create-service \
            --cluster "$CLUSTER_NAME" \
            --service-name "$service_name" \
            --task-definition "$task_def" \
            --desired-count 1 \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=[$SUBNETS],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
            --region "$AWS_REGION" \
            --output text --query "service.serviceName" > /dev/null
        echo -e "${GREEN}✓ Created ECS service: $service_name${NC}"
    fi
}

create_service "$SERVICE_SERVER" "$TASK_DEF_SERVER" "5001"
create_service "$SERVICE_CLIENT" "$TASK_DEF_CLIENT" "80"

# ── Step 9: Print Summary ─────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}=====================================================${NC}"
echo -e "${BLUE}  Bootstrap Complete! Add these GitHub Secrets:${NC}"
echo -e "${BLUE}=====================================================${NC}"
echo ""
echo -e "${GREEN}Go to: GitHub → Your Repo → Settings → Secrets → Actions → New repository secret${NC}"
echo ""
echo "  AWS_ACCESS_KEY_ID       = <your IAM user access key>"
echo "  AWS_SECRET_ACCESS_KEY   = <your IAM user secret key>"
echo "  AWS_REGION              = ${AWS_REGION}"
echo "  ECR_REGISTRY            = ${ECR_REGISTRY}"
echo "  ECS_CLUSTER             = ${CLUSTER_NAME}"
echo "  ECS_SERVICE_SERVER      = ${SERVICE_SERVER}"
echo "  ECS_SERVICE_CLIENT      = ${SERVICE_CLIENT}"
echo "  ECS_TASK_DEF_SERVER     = ${TASK_DEF_SERVER}"
echo "  ECS_TASK_DEF_CLIENT     = ${TASK_DEF_CLIENT}"
echo ""
echo -e "${YELLOW}NOTE: VITE_API_URL and VITE_GOOGLE_CLIENT_ID must also be set${NC}"
echo -e "${YELLOW}      (already exist from your EC2 deploy secrets).${NC}"
echo ""
echo -e "${YELLOW}IMPORTANT: After first ECS deployment, update the CLIENT_URL secret in${NC}"
echo -e "${YELLOW}           AWS Secrets Manager (fsdproj/CLIENT_URL) with the ECS server public IP.${NC}"
echo ""
echo -e "${GREEN}All done! Push to main/master to trigger the ECR → ECS pipeline.${NC}"
