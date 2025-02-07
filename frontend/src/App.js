import { useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Lưu lịch sử chat

  const handleSend = async () => {
    if (!text.trim()) return;

    const newMessage = { type: "user", text }; // Tin nhắn từ người dùng
    setChatHistory((prevChat) => [...prevChat, newMessage]); // Thêm vào lịch sử chat

    try {
      const response = await fetch("http://localhost:5000/api/receive-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();
      const botReply = {
        type: "bot",
        text: data.reply || "Không có phản hồi!",
      };

      setChatHistory((prevChat) => [...prevChat, botReply]); // Thêm phản hồi từ bot vào lịch sử chat
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setChatHistory((prevChat) => [
        ...prevChat,
        { type: "bot", text: "Đã xảy ra lỗi, vui lòng thử lại!" },
      ]);
    }

    setText(""); // Xóa ô nhập sau khi gửi
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "20px",
      }}
    >
      <h2>Chat với BRARISTA</h2>
      <div
        style={{
          width: "300px",
          height: "400px",
          border: "1px solid #ccc",
          padding: "10px",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.type === "user" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "10px",
                backgroundColor: msg.type === "user" ? "#007bff" : "#ccc",
                color: msg.type === "user" ? "white" : "black",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ padding: "8px", marginRight: "10px", width: "250px" }}
      />
      <button
        onClick={handleSend}
        style={{ padding: "8px 12px", backgroundColor: "blue", color: "white" }}
      >
        Gửi
      </button>
    </div>
  );
}

export default App;
