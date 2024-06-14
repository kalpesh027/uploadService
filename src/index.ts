import express, { Request, Response } from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { generate } from "./utils";
import { getAllFiles } from "./files";
import path from "path";
import { uploadFile } from "./aws";
import { createClient } from "redis";

const publisher = createClient();
const subscriber = createClient();

(async () => {
    await publisher.connect();
    await subscriber.connect();
})();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req: Request, res: Response) => {
    try {
        const { repoUrl } = req.body;
        const id = generate();
        const repoPath = path.join(__dirname, `output/${id}`);
        
        await simpleGit().clone(repoUrl, repoPath);
        const files = getAllFiles(repoPath);

        for (const file of files) {
            const relativePath = path.relative(repoPath, file);
            const cloudPath = path.join('output', id, relativePath);
            await uploadFile(cloudPath, file);
        }

        await new Promise((resolve) => setTimeout(resolve, 5000));
        await publisher.lPush("build-queue", id);
        await publisher.hSet("status", id, "uploaded");

        res.json({ id });
    } catch (error) {
        console.error("Error in /deploy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/status", async (req: Request, res: Response) => {
    try {
        const id = req.query.id as string;
        const status = await subscriber.hGet("status", id);
        res.json({ status });
    } catch (error) {
        console.error("Error in /status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
