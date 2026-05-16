import express from "express";
import multer from "multer";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

app.get("/", (req, res) => {
  res.json({
    message: "Server running",
  });
});

app.post("/api/generate-image", upload.single("image"), async (req, res) => {
  try {
    const prompt =
      req.body.prompt ||
      "업로드한 사진을 공포 분위기의 이미지로 수정해줘.";

    if (!req.file) {
      return res.status(400).json({
        message: "이미지가 필요합니다.",
      });
    }

    const base64Image = req.file.buffer.toString("base64");

    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
              {
                inlineData: {
                  mimeType: req.file.mimetype,
                  data: base64Image,
                },
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": GEMINI_API_KEY,
        },
      }
    );

    const parts =
      response.data.candidates?.[0]?.content?.parts || [];

    const imagePart = parts.find(
      (part) => part.inlineData
    );

    if (!imagePart) {
      return res.status(500).json({
        message: "생성된 이미지 없음",
      });
    }

    const generatedImage =
      `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

    res.json({
      image: generatedImage,
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      message: "Gemini API 오류",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});