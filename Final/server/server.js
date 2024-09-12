/*import express from "express";
import cors from "cors";
import records from "./routes/record.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
*/import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import records from "./routes/record.js";

// Convert __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5050;
const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads")); // Directory for storing uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB file size limit
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/record", records);

// File upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  
  // Send response with file details
  res.send({
    originalName: req.file.originalname,
    filename: req.file.filename,
    size: req.file.size,
    path: `/uploads/${req.file.filename}`
  });
});

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
