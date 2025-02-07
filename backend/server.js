const { getGeminiResponse } = require("./index.js");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API nhận tin nhắn từ frontend
app.post("/api/receive-text", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Tin nhắn không được để trống!" });
    }

    const response = await getGeminiResponse(message); // Gọi API lấy phản hồi từ Gemini
    console.log("Gemini trả lời:", response);

    res.json({ success: true, reply: response }); // Trả về phản hồi từ Gemini
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi, vui lòng thử lại sau!" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
