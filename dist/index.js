"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const utils_1 = require("./utils");
const files_1 = require("./files");
const path_1 = __importDefault(require("path"));
const aws_1 = require("./aws");
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
const subscriber = (0, redis_1.createClient)();
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield publisher.connect();
    yield subscriber.connect();
}))();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { repoUrl } = req.body;
        const id = (0, utils_1.generate)();
        const repoPath = path_1.default.join(__dirname, `output/${id}`);
        yield (0, simple_git_1.default)().clone(repoUrl, repoPath);
        const files = (0, files_1.getAllFiles)(repoPath);
        for (const file of files) {
            const relativePath = path_1.default.relative(repoPath, file);
            const cloudPath = path_1.default.join('output', id, relativePath);
            yield (0, aws_1.uploadFile)(cloudPath, file);
        }
        yield new Promise((resolve) => setTimeout(resolve, 5000));
        yield publisher.lPush("build-queue", id);
        yield publisher.hSet("status", id, "uploaded");
        res.json({ id });
    }
    catch (error) {
        console.error("Error in /deploy:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const status = yield subscriber.hGet("status", id);
        res.json({ status });
    }
    catch (error) {
        console.error("Error in /status:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
