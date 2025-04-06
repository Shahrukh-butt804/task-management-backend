import cookieParser from "cookie-parser";
import cors from "cors";
import {config} from "dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { router } from "./routes/index.js";
import { testingRouter } from "./routes/testing.route.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import NodeCache from "node-cache";

const myCache = new NodeCache({ stdTTL: 100, checkperiod: 120 }); //stdTTl 10 minute  check period 120 minutes
// stdTTl ====>> Standard Time-To-Live 
// If stdTTL is set to 0, cache entries will not expire automatically

// The checkperiod in node-cache defines how often (in seconds) the cache will automatically scan and remove expired entries

// When an entry reaches its TTL (time-to-live), it still exists in memory until the cache does a cleanup.
// The checkperiod ensures expired entries are removed periodically to free up memory.
// If checkperiod = 0, expired entries are not automatically deleted, but they won't be returned when accessed.

// dotenv
config();


const app: Application = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: ["GET,HEAD,PUT,PATCH,POST,DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(errorMiddleware)

// testing routes
app.use("/", testingRouter);

// Router
app.use("/api/v1", router);



export { app };

