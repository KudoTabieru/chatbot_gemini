const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Dữ liệu Custom Knowledge Base
const knowledgeBase = `
  Bạn là một nhân viên tên Minh hỗ trợ khách hàng về dịch vụ làm đẹp. Trả lời câu hỏi sau một cách ngắn gọn, đúng trọng tâm, không lan man. Nếu cần, hãy tóm tắt trong 2-3 câu mà vẫn đảm bảo đầy đủ ý quan trọng.

  - Cửa hàng có các dịch vụ như phun xăm chân mày, tiêm filler, tiêm meso.
  - Giờ mở cửa: 9h00 - 18h00 hàng ngày.
  - Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM.
  - Số điện thoại hỗ trợ: 0909 123 456.
  
`;

async function getGeminiResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Kết hợp Knowledge Base với câu hỏi của người dùng
    const fullPrompt = `${knowledgeBase}\nNgười dùng hỏi: ${prompt}`;

    const result = await model.generateContentStream([fullPrompt]);
    let responseText = "";

    for await (const chunk of result.stream) {
      responseText += chunk.text(); // Lấy dữ liệu từ Gemini AI
    }

    return (
      responseText.trim() ||
      "Xin lỗi, tôi không thể xử lý yêu cầu của bạn ngay bây giờ."
    );
  } catch (error) {
    console.error("Lỗi khi gọi Gemini API:", error);
    return "Xin lỗi, đã xảy ra lỗi trong quá trình xử lý.";
  }
}

module.exports = { getGeminiResponse };
