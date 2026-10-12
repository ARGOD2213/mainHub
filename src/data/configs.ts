/** Starter configs shown on the Platform section: the baseline every project gets. */

export const configs: { id: string; label: string; file: string; lang: string; code: string }[] = [
  {
    id: 'docker',
    label: 'Dockerfile',
    file: 'Dockerfile',
    lang: 'dockerfile',
    code: `# syntax=docker/dockerfile:1.7
# Build: cached Maven deps, then layered Spring Boot jar
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN --mount=type=cache,target=/root/.m2 ./mvnw -q dependency:go-offline
COPY src src
RUN --mount=type=cache,target=/root/.m2 ./mvnw -q -DskipTests package \\
 && java -Djarmode=tools -jar target/app.jar extract --layers --launcher --destination /layers

# Run: distroless, non-root, no shell
FROM gcr.io/distroless/java21-debian12:nonroot
WORKDIR /app
COPY --from=build /layers/dependencies/ ./
COPY --from=build /layers/spring-boot-loader/ ./
COPY --from=build /layers/snapshot-dependencies/ ./
COPY --from=build /layers/application/ ./
EXPOSE 8080
ENTRYPOINT ["/usr/bin/java", "-XX:MaxRAMPercentage=75", \\
            "org.springframework.boot.loader.launch.JarLauncher"]`,
  },
  {
    id: 'k8s',
    label: 'Kubernetes',
    file: 'k8s/api.yaml',
    lang: 'yaml',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 3
  strategy:
    rollingUpdate: { maxSurge: 25%, maxUnavailable: 0 }
  selector:
    matchLabels: { app: api }
  template:
    metadata:
      labels: { app: api }
    spec:
      serviceAccountName: api          # IRSA: AWS access without static keys
      topologySpreadConstraints:       # spread pods across availability zones
        - maxSkew: 1
          topologyKey: topology.kubernetes.io/zone
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels: { app: api }
      containers:
        - name: api
          image: 123456789012.dkr.ecr.ap-south-1.amazonaws.com/api:1.4.2
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: 500m, memory: 768Mi }
            limits: { memory: 768Mi }
          readinessProbe:
            httpGet: { path: /actuator/health/readiness, port: 8080 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /actuator/health/liveness, port: 8080 }
            initialDelaySeconds: 30
          lifecycle:
            preStop: { sleep: { seconds: 10 } }   # drain before SIGTERM
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: api }
  minReplicas: 3
  maxReplicas: 40
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 65 }
  behavior:
    scaleDown: { stabilizationWindowSeconds: 300 }
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: api
spec:
  minAvailable: 2
  selector:
    matchLabels: { app: api }`,
  },
  {
    id: 'actions',
    label: 'GitHub Actions',
    file: '.github/workflows/ship.yml',
    lang: 'yaml',
    code: `name: ship
on:
  push: { branches: [main] }

permissions:
  id-token: write    # OIDC into AWS: no long-lived keys in GitHub
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { distribution: temurin, java-version: '21', cache: maven }
      - run: ./mvnw -B verify        # unit + Testcontainers integration tests

  image:
    needs: test
    runs-on: ubuntu-latest
    outputs:
      tag: \${{ github.sha }}
    steps:
      - uses: actions/checkout@v4
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/gha-deploy
          aws-region: ap-south-1
      - id: ecr
        uses: aws-actions/amazon-ecr-login@v2
      - run: docker build -t \${{ steps.ecr.outputs.registry }}/api:\${{ github.sha }} .
      - uses: aquasecurity/trivy-action@0.28.0
        with:
          image-ref: \${{ steps.ecr.outputs.registry }}/api:\${{ github.sha }}
          severity: CRITICAL,HIGH
          exit-code: '1'             # block the release on serious CVEs
      - run: docker push \${{ steps.ecr.outputs.registry }}/api:\${{ github.sha }}

  deploy:
    needs: image
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { repository: acme/gitops, token: \${{ secrets.GITOPS_TOKEN }} }
      - run: |
          yq -i '.image.tag = "\${{ github.sha }}"' apps/api/values-staging.yaml
          git config user.name ci-bot
          git config user.email ci-bot@users.noreply.github.com
          git commit -am "api \${{ github.sha }}" && git push
          # Argo CD syncs staging; once smoke + load tests pass, the same tag
          # is promoted to prod, where Argo Rollouts runs the canary`,
  },
  {
    id: 'terraform',
    label: 'Terraform',
    file: 'infra/eks.tf',
    lang: 'hcl',
    code: `module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name            = "prod"
  cidr            = "10.0.0.0/16"
  azs             = ["ap-south-1a", "ap-south-1b", "ap-south-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = false   # one per AZ: no single point of failure
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "prod"
  cluster_version = "1.31"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  enable_cluster_creator_admin_permissions = true

  eks_managed_node_groups = {
    system = {
      instance_types = ["m6i.large"]
      min_size       = 2
      max_size       = 3
      desired_size   = 2
    }
  }
  # app workloads run on Karpenter-provisioned nodes (spot + on-demand)
}`,
  },
]

export const pipeline: { id: string; name: string; detail: string; canary?: boolean }[] = [
  { id: 'commit', name: 'Merge to main', detail: 'PR approved; branch protection passed.' },
  { id: 'test', name: 'Unit + integration tests', detail: 'JUnit and Testcontainers against real Postgres and Redis.' },
  { id: 'sast', name: 'Static analysis', detail: 'SAST and dependency audit; secrets scan.' },
  { id: 'build', name: 'Build image', detail: 'Multi-stage, layered, distroless.' },
  { id: 'scan', name: 'Image scan', detail: 'Trivy blocks critical or high CVEs.' },
  { id: 'push', name: 'Push to ECR', detail: 'Tagged with the commit SHA. Immutable tags.' },
  { id: 'gitops', name: 'GitOps bump', detail: 'Helm values updated in the GitOps repo.' },
  { id: 'staging', name: 'Argo CD → staging', detail: 'Synced automatically; migrations run first.' },
  { id: 'smoke', name: 'Smoke + k6 load test', detail: 'Critical paths and a short load test at expected peak.' },
  { id: 'canary', name: 'Canary 10% → prod', detail: 'Argo Rollouts watches error rate and p95 latency.', canary: true },
  { id: 'promote', name: 'Promote to 100%', detail: 'Analysis passed; old ReplicaSet scaled down.' },
]
