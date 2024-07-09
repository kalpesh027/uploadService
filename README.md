
# Repository Deployment System

####  Overview

This project provides an automated system for deploying GitHub repositories to a live server. It consists of three main services: Upload Service, Deploy Service, and Request Service. These services work together to clone a repository, build the project, and serve the built files via a shareable link.








## Architecture

#### 1. [Upload Service](https://github.com/kalpesh027/uploadService.git)

 - Endpoint: `/deploy`

-  Description: Clones a GitHub repository, uploads the files to Cloudflare R2, and queues the deployment ID for building.

- Technology: Express.js, Simple-Git, Redis, Cloudflare R2
- Ports: 3000


#### 2. [Deploy Service ](https://github.com/kalpesh027/deployService.git)                                                         

- Description: Listens for new deployment IDs, downloads the files from Cloudflare R2, builds the project, and uploads the built files back to Cloudflare R2.

- Technology: Node.js, Redis, Cloudflare R2

- Ports: 3000

#### 3. [Request Service](https://github.com/kalpesh027/requestHandler.git)                                            

- Endpoint: `/:id/*`
- Description: Serves the built files from Cloudflare R2 based on the deployment ID and file path.
- Technology: Express.js, AWS SDK (S3)
- Ports: 3001

## Detailed Flow

#### 1. Deploy Request

- A client sends a `POST` request to the `/deploy` endpoint with the GitHub repository URL.
- The Upload Service generates a unique ID for this deployment using the `generate()` function.
- The repository is cloned into a directory named with this unique ID.
- The files from the cloned repository are uploaded to the Cloudflare R2 bucket under a path that includes this ID (e.g., `output/<unique-id>/`).
 - The server pushes this ID onto a Redis list (build-queue) and sets its status in a Redis hash (status) to "uploaded".
- The server responds to the client with this unique ID.

#### 2. Build Process

- The Deploy Service continuously listens for new IDs on the build-queue Redis list using a blocking pop `(brPop)`.
- When a new ID is found, the server pulls it from the queue and starts the build process for that specific ID.
- The server downloads the files for this ID from the Cloudflare R2 bucket.
- The server runs the build commands in the directory corresponding to this ID.
- After building, the server uploads the built files to the Cloudflare R2 bucket under a `dist/<unique-id>/` path.
- The server updates the status for this ID in the Redis hash (status) to "deployed"

#### 3. Status Request

- A client sends a GET request to the `/status` endpoint with the unique ID as a query parameter.
- The server retrieves the status for this ID from the Redis hash (status) and responds to the client with the current status.

#### 4. Serve Built Files:

- The Request Service handles requests to serve the built files.
- It constructs the file path based on the unique ID and file path provided in the URL.
- The service retrieves the file from Cloudflare R2 and serves it to the client.

## Author
Kalpesh Ghodekar
[Instagram](https://www.instagram.com/kalpesh__027/)  |  [LinkedIn](https://www.linkedin.com/in/kalpesh-ghodekar/) | [Twitter](https://twitter.com/kalpesh__027)
