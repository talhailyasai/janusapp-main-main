import React, { useState, useRef, useEffect } from "react";
import "./style.css";
import api from "api";
import { useTranslation } from "react-i18next"; // Add this import

const JanusChatBot = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatbotEnabled, setIsChatbotEnabled] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      // Using your api configuration
      const response = await api.post("/bedrock/chat", {
        message: userMessage,
        language: i18n.language,
      });
      if (!response?.data?.response) {
        setMessages((prev) => [
          ...prev,
          {
            text: "Sorry, I encountered an error. Please try again.",
            isUser: false,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          text: response.data.response,
          isUser: false,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      // Your API interceptor will handle the error toast notifications
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, I encountered an error. Please try again.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Add this function to convert newlines to JSX breaks and preserve formatting
  const formatMessage = (text) => {
    return text.split("\n").map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i !== text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      {isChatbotEnabled && (
        <div className="floating-chatbot">
          {/* Container for closed state with hover menu */}
          {!isOpen && (
            <div
              className="chat-button-container"
              // style={{
              //   padding: "100px",
              //   margin: "-100px",
              // }}
            >
              <div className="floating-menu">
                <button
                  className="floating-menu-item open-btn"
                  onClick={() => setIsOpen(true)}
                  title="Open Chat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                  </svg>
                </button>
                <button
                  className="floating-menu-item close-btn"
                  onClick={() => setIsChatbotEnabled(false)}
                  title="Disable Chat"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
              <button
                className="chat-toggle-btn"
                onClick={() => setIsOpen(true)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                </svg>
              </button>
            </div>
          )}

          {/* Container for open state with close button */}
          {isOpen && (
            <>
              <div className="chat-button-container-open">
                <button
                  className="chat-toggle-btn open"
                  onClick={() => setIsOpen(false)}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </button>
              </div>
              <div className="chat-window">
                <div className="chat-header">
                  <div className="chat-title">
                    <div className="bot-avatar">🤖</div>
                    <div>
                      <h3>{t("common.pages.title")}</h3>
                      <span className="status">{t("common.pages.status")}</span>
                    </div>
                  </div>
                </div>

                <div className="messages-container">
                  {messages.length === 0 && (
                    <div className="welcome-message">
                      <h4>{t("common.pages.greeting")}</h4>
                      <p>{t("common.pages.help_message")}</p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`message ${
                        message.isUser ? "user-message" : "bot-message"
                      }`}
                    >
                      {formatMessage(message.text)}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="message bot-message typing">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="chat-input">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("common.pages.input_placeholder")}
                    disabled={isLoading}
                    rows={1}
                    className="chat-textarea"
                  />
                  <button type="submit" disabled={isLoading || !input.trim()}>
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                    </svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default JanusChatBot;
