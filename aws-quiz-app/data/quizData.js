const quizData = [
    {
        question: "A retail company wants to test a new recommendation model in production. They want to send a copy of live traffic to the new model to monitor its performance, but the actual responses sent back to users must still come from the old model so the user experience is unaffected. Which deployment strategy should be used?",
        options: [
            "A/B Testing.",
            "Canary Deployment.",
            "Shadow deployment.",
            "Blue/Green Deployment."
        ],
        correct: 2,
        explanations: [
            "Incorrect. A/B testing splits traffic, meaning some users would actually receive predictions from the new model, affecting their user experience.",
            "Incorrect. A Canary deployment shifts actual live traffic (e.g., 5%) to the new model, meaning a portion of users would be impacted.",
            "Correct! Shadow deployment actively logs the new model's predictions while completely isolating the user experience, ensuring responses strictly come from the old model.",
            "Incorrect. Blue/Green actively shifts actual live traffic to the new infrastructure."
        ]
    },
    {
        question: "An ML team has trained a deep learning model using PyTorch. They need to deploy this model to thousands of edge cameras with limited compute and memory resources. Which AWS service or feature should they use to optimize the model's footprint for the specific hardware architecture of the cameras?",
        options: [
            "AWS IoT Greengrass.",
            "Amazon SageMaker Edge Manager.",
            "Amazon SageMaker Neo.",
            "AWS Panorama."
        ],
        correct: 2,
        explanations: [
            "Incorrect. Greengrass provides the local runtime environment to execute the model, but it does not compile or shrink the model footprint itself.",
            "Incorrect. Edge Manager manages fleets of edge devices and model deployments, but it is not a model compiler.",
            "Correct! Amazon SageMaker Neo is a compiler designed specifically to optimize models for target edge hardware architectures, reducing footprint and improving performance.",
            "Incorrect. Panorama is a physical appliance used to add computer vision to existing IP cameras, not a model compiler."
        ]
    },
    {
        question: "A healthcare company needs to run inference on high-resolution medical images. Each image payload is approximately 50 MB, and the complex computer vision inference process takes around 2 minutes per image to complete. Which SageMaker deployment option is architecturally required for this workload?",
        options: [
            "Amazon SageMaker Serverless Inference.",
            "Amazon SageMaker Real-Time Endpoint.",
            "Amazon SageMaker Asynchronous Inference.",
            "Amazon SageMaker Batch Transform."
        ],
        correct: 2,
        explanations: [
            "Incorrect. Serverless inference has a strict 4 MB payload limit and a 60-second execution timeout.",
            "Incorrect. Real-time endpoints have a strict 6 MB payload limit and a 60-second execution timeout.",
            "Correct! Asynchronous inference supports massive payloads (up to 1 GB) and long timeouts (up to 1 hour), making it the only viable online option for this workload.",
            "Incorrect. While Batch Transform can handle this, it is an offline job. The prompt implies a need for an inference architecture, typically requested on-demand."
        ]
    },
    {
        question: "A B2B SaaS company has trained 5,000 distinct, custom XGBoost models—one for each of their enterprise clients. The models share the same ML framework and container, but are rarely used simultaneously. Which deployment strategy provides the lowest hosting cost and least operational overhead?",
        options: [
            "Use an Amazon SageMaker Multi-Model Endpoint.",
            "Use Amazon SageMaker Multi-Container Endpoints.",
            "Deploy 5,000 Serverless Inference Endpoints.",
            "Use AWS Step Functions with Lambda."
        ],
        correct: 0,
        explanations: [
            "Correct! Multi-Model Endpoints (MME) dynamically load thousands of models sharing the same framework into memory on a single fleet of instances, drastically reducing compute costs.",
            "Incorrect. Multi-Container Endpoints host a maximum of 15 different containers on a single endpoint, failing the 5,000 model requirement.",
            "Incorrect. Managing 5,000 distinct serverless endpoints introduces massive operational overhead compared to a single MME.",
            "Incorrect. Step Functions cannot natively host machine learning models."
        ]
    },
    {
        question: "A data scientist is building an inference architecture that requires the strict sequential execution of three steps: data preprocessing using a scikit-learn script, model prediction using an XGBoost model, and post-processing using a custom Python script. How can this be deployed as a single, fully managed endpoint?",
        options: [
            "Create an Amazon SageMaker Inference Pipeline.",
            "Orchestrate with AWS Step Functions.",
            "Deploy using an AWS Glue ETL Job.",
            "Use Amazon SageMaker Feature Store."
        ],
        correct: 0,
        explanations: [
            "Correct! SageMaker Inference Pipelines allow you to deploy a linear sequence of 2 to 15 containers (like pre/post-processing scripts) as a single, unified fully managed endpoint.",
            "Incorrect. Step Functions orchestrates workflows, but it cannot package them into a single REST API endpoint for real-time inference.",
            "Incorrect. AWS Glue is an offline ETL tool, it cannot be used to host real-time inference endpoints.",
            "Incorrect. Feature Store is a database for ML features, not an inference hosting environment."
        ]
    },
    {
        question: "A bank deployed a credit risk model six months ago. Recently, the macroeconomic environment has changed drastically, and the distribution of incoming applicant income levels has shifted significantly away from the baseline established during training. Which SageMaker feature will automatically detect this specific issue?",
        options: [
            "Amazon SageMaker Model Monitor with Data Quality.",
            "Amazon SageMaker Clarify Bias monitoring.",
            "Model Quality Monitor.",
            "Model Explainability Monitor."
        ],
        correct: 0,
        explanations: [
            "Correct! The Data Quality Monitor detects when the statistical distribution of incoming live data features drifts from the baseline data used during training.",
            "Incorrect. Clarify Bias monitoring checks if predictions are unfairly targeting specific demographic facets, not general feature distribution drift.",
            "Incorrect. Model Quality Monitor tracks if the actual *accuracy* of the model degrades, which requires waiting for ground-truth labels to be ingested.",
            "Incorrect. Explainability Monitor tracks if the *importance* of features has changed, not the underlying distribution of the data itself."
        ]
    },
    {
        question: "An MLOps engineer is configuring an automated CI/CD pipeline. When a new model is approved, it must be deployed to production. The engineer wants to gradually shift 15% of the traffic to the new model, monitor for errors for 30 minutes, and automatically roll back if the 5xx error rate spikes. Which feature natively supports this?",
        options: [
            "Amazon API Gateway canary release deployments.",
            "AWS CodeDeploy linear traffic shifting.",
            "Amazon SageMaker endpoint Blue/Green deployments.",
            "AWS Step Functions automated rollback."
        ],
        correct: 2,
        explanations: [
            "Incorrect. While API Gateway supports canaries, it lacks native integration with SageMaker model metrics for automated ML rollback.",
            "Incorrect. CodeDeploy is for EC2/Lambda compute deployments, it does not natively orchestrate SageMaker ML endpoints.",
            "Correct! SageMaker natively utilizes Blue/Green deployments combined with Canary/Linear shifting to safely test new models and auto-rollback based on CloudWatch alarms.",
            "Incorrect. Step Functions orchestrates workflows but does not natively handle the traffic shifting mechanisms of a SageMaker endpoint."
        ]
    },
    {
        question: "An agricultural company has deployed ML models to autonomous tractors in the field. The tractors frequently lose internet connectivity but must continue making critical inference decisions locally in real-time. Which AWS service enables the secure deployment and local execution of these ML models directly on the tractors?",
        options: [
            "Amazon SageMaker Edge Manager.",
            "AWS IoT Greengrass.",
            "AWS Outposts.",
            "Amazon EKS Anywhere."
        ],
        correct: 1,
        explanations: [
            "Incorrect. Edge Manager handles the management and monitoring of edge models, but Greengrass provides the actual local execution runtime.",
            "Correct! AWS IoT Greengrass provides the local execution environment required to securely run ML models on physical edge devices when they are completely offline.",
            "Incorrect. AWS Outposts is a massive physical server rack installed in data centers, not something placed on an autonomous tractor.",
            "Incorrect. EKS Anywhere is for running Kubernetes on-premises, not specialized for disconnected IoT edge device inference."
        ]
    },
    {
        question: "A startup has a custom NLP model used for internal document summarization. The tool is used sporadically, sometimes sitting idle for days, but experiences sudden spikes when a batch of documents is uploaded at month-end. The team wants to minimize costs and pay zero dollars during idle times. Which deployment option is best?",
        options: [
            "Amazon SageMaker Serverless Inference.",
            "Amazon SageMaker Asynchronous Inference.",
            "Amazon EC2 Spot Instances.",
            "Auto-scaling Real-time Endpoints."
        ],
        correct: 0,
        explanations: [
            "Correct! Serverless Inference explicitly scales down to zero instances when not in use, meaning you pay exactly zero dollars for inference compute during idle periods.",
            "Incorrect. Asynchronous Inference requires at least one instance running or complex auto-scaling rules to scale to zero, making it less native than Serverless for this.",
            "Incorrect. EC2 Spot instances can be interrupted and require managing underlying servers, defeating the fully managed requirement.",
            "Incorrect. Real-time endpoints require at least one instance to remain running at all times, meaning you are billed even when idle."
        ]
    },
    {
        question: "An enterprise requires cross-account model promotion. A model trained in the 'Development' AWS account must be manually reviewed and approved by a manager before it is automatically deployed to the 'Production' account. Which AWS service acts as the central catalog to manage these approval statuses?",
        options: [
            "AWS CodePipeline Manual Approval.",
            "Amazon SageMaker Model Registry.",
            "AWS Service Catalog.",
            "Amazon SageMaker Feature Store."
        ],
        correct: 1,
        explanations: [
            "Incorrect. CodePipeline executes the deployment, but it is not a central ML catalog for storing model artifacts and metadata.",
            "Correct! Amazon SageMaker Model Registry acts as the central catalog specifically designed to store ML model versions, manage their approval statuses, and trigger downstream cross-account deployments.",
            "Incorrect. Service Catalog is used by IT teams to create approved infrastructure portfolios, not ML model versioning.",
            "Incorrect. Feature Store manages ML features for training and inference, not the final trained model artifacts."
        ]
    },
    {
        question: "A marketing team needs to generate predictions for a massive 500 GB CSV dataset of customer records sitting in Amazon S3. The predictions are not time-sensitive, do not require a live API, and only need to be processed once a month. What is the most cost-effective SageMaker capability for this task?",
        options: [
            "Amazon SageMaker Batch Transform.",
            "Amazon SageMaker Asynchronous Inference.",
            "Amazon EMR with Spark MLlib.",
            "Amazon SageMaker Data Wrangler."
        ],
        correct: 0,
        explanations: [
            "Correct! Batch Transform is purpose-built for offline inference on massive datasets, spinning up compute to process the data and tearing it down automatically to save costs.",
            "Incorrect. Asynchronous inference requires managing an active endpoint API, which is unnecessary for a once-a-month offline job.",
            "Incorrect. Amazon EMR is a big data framework; utilizing it specifically for a SageMaker inference job introduces massive unnecessary architectural overhead.",
            "Incorrect. Data Wrangler is a visual data preparation tool, not an inference engine."
        ]
    },
    {
        question: "A data science team wants to orchestrate an end-to-end ML workflow consisting of data processing, training, model evaluation, and deployment. They want to define this workflow entirely in Python using a native ML orchestration tool that integrates seamlessly with SageMaker Model Registry. Which tool should they use?",
        options: [
            "AWS Step Functions.",
            "Amazon MWAA (Apache Airflow).",
            "Amazon SageMaker Pipelines.",
            "AWS CodePipeline."
        ],
        correct: 2,
        explanations: [
            "Incorrect. Step Functions requires defining the state machine in JSON (ASL) or using visual editors, not natively entirely in Python.",
            "Incorrect. While MWAA (Airflow) uses Python, it is a heavy, generalized orchestration tool, not the SageMaker-native tool designed specifically for this purpose.",
            "Correct! SageMaker Pipelines is the native orchestration tool purpose-built for SageMaker, allowing data scientists to define entire end-to-end workflows directly using the Python SDK.",
            "Incorrect. CodePipeline is a general software CI/CD tool, not an ML-native pipeline orchestrated in Python."
        ]
    },
    {
        question: "A mobile app sends user data to an API Gateway, which triggers an AWS Lambda function, which invokes a SageMaker real-time endpoint. The deep learning model takes 40 seconds to generate a prediction. The API Gateway consistently returns a '504 Gateway Timeout' error. How should the engineer resolve this?",
        options: [
            "Increase API Gateway timeout to 60 seconds.",
            "Increase Lambda timeout to 15 minutes.",
            "Use Asynchronous Inference and poll.",
            "Switch to a WebSocket API in API Gateway."
        ],
        correct: 2,
        explanations: [
            "Incorrect. API Gateway has a hard, unchangeable maximum timeout of exactly 29 seconds. It cannot be increased.",
            "Incorrect. Even if Lambda's timeout is increased, the API Gateway sitting in front of it will still forcefully timeout at 29 seconds.",
            "Correct! For inference taking longer than 29 seconds behind API Gateway, the architecture MUST switch to Asynchronous Inference, where the client receives a token and polls an S3 bucket for the final result.",
            "Incorrect. WebSockets are for persistent bi-directional communication, not standard request-response inference patterns."
        ]
    },
    {
        question: "An ML engineer is deploying a model to a real-time SageMaker endpoint. They need the endpoint to automatically scale instances in and out based on the volume of incoming inference requests. Which specific CloudWatch metric should be used as the target for the target-tracking scaling policy?",
        options: [
            "SageMakerVariantInvocationsPerInstance.",
            "CPUUtilization.",
            "MemoryUtilization.",
            "InvocationsPerEndpoint."
        ],
        correct: 0,
        explanations: [
            "Correct! `SageMakerVariantInvocationsPerInstance` is the standard, AWS-recommended metric to auto-scale SageMaker endpoints based on request traffic load.",
            "Incorrect. CPU utilization can be heavily skewed by the specific algorithm and is often not a reliable indicator of pure incoming request volume.",
            "Incorrect. Memory utilization remains relatively static once a model is loaded into RAM, making it a poor scaling metric.",
            "Incorrect. `InvocationsPerEndpoint` measures total traffic, but does not account for how many instances are currently running, making it useless for per-instance scaling targets."
        ]
    },
    {
        question: "A company is using SageMaker Model Monitor to track their deployed Random Forest model. They want to ensure that the relative importance of the features used by the model has not changed over time compared to the baseline established during training (Feature Attribution Drift). Which type of monitor must they configure?",
        options: [
            "Model Explainability Monitor.",
            "Model Quality Monitor.",
            "Data Quality Monitor.",
            "Bias Monitor."
        ],
        correct: 0,
        explanations: [
            "Correct! The Model Explainability Monitor explicitly tracks feature attribution drift, ensuring the features driving the model's decisions remain mathematically consistent with the training baseline.",
            "Incorrect. Model Quality monitors the actual accuracy of predictions against ground truth labels.",
            "Incorrect. Data Quality monitors the statistical distribution of the raw incoming data, not how the model attributes importance to those features.",
            "Incorrect. Bias Monitor tracks if predictions are unfairly skewed against protected demographics."
        ]
    },
    {
        question: "An ML pipeline uses AWS Step Functions for orchestration. The pipeline needs to execute a SageMaker Training Job. To ensure the Step Functions state machine waits for the SageMaker Training Job to completely finish (succeed or fail) before moving to the next step, how should the task be configured?",
        options: [
            "Set WaitForCompletion to True in the payload.",
            "Use the `.sync` service integration pattern.",
            "Configure a CloudWatch Event Rule.",
            "Use an AWS Lambda polling function."
        ],
        correct: 1,
        explanations: [
            "Incorrect. There is no `WaitForCompletion` parameter in standard SageMaker API payloads.",
            "Correct! Appending `.sync` to the Step Functions API integration ensures the state machine natively pauses and waits for the long-running SageMaker job to finish before progressing.",
            "Incorrect. While CloudWatch can detect job completion, it requires complex decoupled architecture. Native Step Functions handles this easily.",
            "Incorrect. Lambda polling is an inefficient anti-pattern when native `.sync` integration exists."
        ]
    },
    {
        question: "A security team dictates that all inference traffic to a SageMaker real-time endpoint originating from an Amazon EC2 instance in a private subnet must absolutely not traverse the public internet. What must the ML engineer configure to satisfy this requirement?",
        options: [
            "Create a Gateway VPC Endpoint for SageMaker.",
            "Create an Interface VPC Endpoint.",
            "Attach a NAT Gateway to the private subnet.",
            "Enable SageMaker Network Isolation."
        ],
        correct: 1,
        explanations: [
            "Incorrect. Gateway VPC Endpoints are exclusively for Amazon S3 and DynamoDB.",
            "Correct! Accessing SageMaker inference APIs securely from a private VPC without internet traversal strictly requires an Interface VPC Endpoint powered by AWS PrivateLink.",
            "Incorrect. A NAT Gateway routes traffic out to the public internet, completely violating the strict security mandate.",
            "Incorrect. Network Isolation prevents a training container from making outbound network calls; it does not secure the inbound API inference traffic."
        ]
    },
    {
        question: "A team has developed a custom computer vision model packaged in a Docker container. They want to run offline batch inference on a massive dataset of images in S3 using SageMaker Batch Transform. How does SageMaker Batch Transform natively pass the data to the custom container during execution?",
        options: [
            "By mapping S3 directly to `/opt/ml/input`.",
            "Via HTTP POST requests to `/invocations`.",
            "Through standard input (stdin).",
            "Using AWS Glue streaming."
        ],
        correct: 1,
        explanations: [
            "Incorrect. Mapping data to `/opt/ml/input` is the protocol for SageMaker Training Jobs, not Batch Transform inference jobs.",
            "Correct! Internally, SageMaker Batch Transform functions by taking data from S3 and passing it to the custom container via local HTTP POST requests to the `/invocations` endpoint.",
            "Incorrect. Containers in SageMaker do not accept inference data via standard terminal input streams.",
            "Incorrect. Glue streaming is an entirely different AWS analytics service."
        ]
    },
    {
        question: "An engineer is utilizing a SageMaker Multi-Model Endpoint (MME) backed by CPU instances. When a specific model is invoked for the first time in several days, the client application experiences an unusually high spike in latency. What is the fundamental cause of this latency?",
        options: [
            "The container is experiencing a cold start.",
            "The API Gateway is throttling the request.",
            "The model artifacts are being actively downloaded.",
            "The EBS volume is warming up."
        ],
        correct: 2,
        explanations: [
            "Incorrect. The container itself is already running on the MME instance. The latency is specific to the model.",
            "Incorrect. API Gateway throttling results in 429 errors, not extreme latency spikes on a successful request.",
            "Correct! MMEs dynamically load models. If a rarely used model isn't currently in memory, the initial request is heavily delayed while its artifacts are physically downloaded from S3.",
            "Incorrect. EBS volume warming is an older EC2 concept and not the primary mechanism causing MME latency spikes."
        ]
    },
    {
        question: "A team is running a PyTorch Deep Learning model on a SageMaker real-time endpoint using a GPU instance. Monitoring shows that CPU utilization is at 10%, but the GPU memory is fully saturated. They want to drastically reduce hosting costs while maintaining high throughput. Which AWS hardware acceleration strategy is most cost-effective for this specific deep learning inference workload?",
        options: [
            "Migrate to an AWS Inferentia instance type.",
            "Enable Elastic Inference on a CPU instance.",
            "Switch to an AWS Graviton instance.",
            "Implement Model Parallelism."
        ],
        correct: 0,
        explanations: [
            "Correct! AWS Inferentia chips (Inf1/Inf2 instances) are purpose-built by AWS to provide the highest performance and lowest cost specifically for deep learning inference workloads.",
            "Incorrect. Elastic Inference is largely legacy and attaches minor GPU acceleration to CPUs, but Inferentia provides massively better cost-to-performance for heavy PyTorch loads.",
            "Incorrect. Graviton processors are highly efficient general CPUs, but they will likely choke on a deep learning model that was previously saturating a full GPU.",
            "Incorrect. Model Parallelism is a *training* technique used when a model is too large for one GPU; it is not a hosting hardware strategy."
        ]
    }
];
