const tutorialData = {
    title: "Domain 4 Deep Dive: Deployment & MLOps",
    lead: "This domain focuses on how to host models securely, scale them cost-effectively, orchestrate automated CI/CD pipelines, and monitor model degradation in production.",
    sections: [
        {
            title: "1. Choosing the Right Deployment Target",
            note: "You must memorize the hard limits for each SageMaker endpoint type.",
            themeColor: "aws-indigo",
            items: [
                "Real-Time Endpoints: Use for sub-second latency with consistent traffic. Max payload is 6 MB. Max timeout is 60 seconds.",
                "Serverless Inference: Use when traffic is intermittent or sporadic. Scales down to zero (pay zero dollars during idle times). Max payload is 4 MB.",
                "Asynchronous Inference: Use for large payloads (up to 1 GB) and long processing times (up to 1 hour). The API Gateway Trap: API Gateway has a strict 29-second timeout. If inference takes longer, use Asynchronous Inference and poll S3 to avoid a 504 Gateway Timeout.",
                "Batch Transform: Use for offline inference on massive datasets. Max payload per record is 100 MB. Uses local HTTP POST requests to /invocations.",
                "Multi-Model Endpoints (MME): Deploy thousands of models on shared infrastructure. Expect a latency spike (cold start) on the first request to a rarely used model as artifacts download from S3."
            ]
        },
        {
            title: "2. Deployment Strategies & Routing",
            note: "",
            themeColor: "purple-500",
            items: [
                "A/B Testing: Splits live traffic. Users receive predictions from the model they are routed to. Used to measure business impact.",
                "Shadow Deployment: Sends a copy of live traffic to a new model to monitor it. Responses back to the user strictly come from the old model.",
                "Canary Deployment: Shifts a small, safe percentage of traffic (e.g., 5%) to a new model to test safety before full rollout.",
                "SageMaker Inference Pipelines: Deploys a linear sequence of containers (Preprocess -> Model -> Postprocess) as a single managed endpoint."
            ]
        },
        {
            title: "3. Edge Computing & Security",
            note: "",
            themeColor: "blue-500",
            items: [
                "SageMaker Neo: A compiler that optimizes a trained model's footprint for specific edge hardware architectures (like smart cameras).",
                "AWS IoT Greengrass: Enables secure deployment and local execution of models on edge devices that frequently lose internet connectivity.",
                "Interface VPC Endpoint: Required if security mandates that inference traffic to a real-time endpoint must absolutely not traverse the public internet."
            ]
        },
        {
            title: "4. MLOps & Model Monitoring",
            note: "",
            themeColor: "teal-500",
            items: [
                "AWS Step Functions: When triggering a SageMaker Training Job, you must append .sync to the integration pattern to make the state machine wait for completion.",
                "SageMaker Model Registry: The central catalog for model versions and cross-account approval statuses.",
                "Data Quality Monitor: Detects if the statistical distribution of incoming live data drifts from the training baseline.",
                "Model Explainability Monitor: Tracks Feature Attribution Drift (ensures the relative importance of features hasn't changed over time)."
            ]
        }
    ]
};
