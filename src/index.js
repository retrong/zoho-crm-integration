require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const { processCSV } = require("./csvProcessor");
const { zohoAuth } = require("./zohoAuth");
const { uploadToZoho } = require("./zohoUpload");

const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Main upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const moduleName = req.body.moduleName;
    if (!moduleName) {
      return res.status(400).json({ error: 'Module name is required' });
    }

    // Process CSV file
    const records = await processCSV(req.file.buffer);

    // Get Zoho access token
    const accessToken = await zohoAuth();

    // Upload to Zoho
    const result = await uploadToZoho(records, moduleName, accessToken);

    res.status(200).json({
      status: 'success',
      message: `Processed ${records.length} records`,
      details: result
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});