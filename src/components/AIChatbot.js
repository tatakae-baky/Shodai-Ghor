import React, { useState, useEffect, useRef } from 'react';
import { generateAPIResponse } from '../services/chatbotAPI';
import './AIChatbot.css';

const AIChatbot = () => {
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isResponseGenerating, setIsResponseGenerating] = useState(false);
  const chatListRef = useRef(null);

  useEffect(() => {
    const savedChats = localStorage.getItem("savedChats");
    if (savedChats) {
      setIsHeaderHidden(true);
      setMessages(JSON.parse(savedChats));
    }
  }, []);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userMessage.trim() && !isResponseGenerating) {
      const newMessages = [...messages, { type: 'outgoing', text: userMessage }];
      setMessages(newMessages);
      setUserMessage('');
      setIsHeaderHidden(true);
      localStorage.setItem("savedChats", JSON.stringify(newMessages));
      await generateResponse(userMessage);
    }
  };

  const generateResponse = async (message) => {
    setIsResponseGenerating(true);
    const loadingMessage = { type: 'incoming', text: '', loading: true };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const response = await generateAPIResponse(message);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { type: 'incoming', text: response }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { type: 'incoming', text: 'Sorry, I encountered an error. Please try again.', error: true }
      ]);
    } finally {
      setIsResponseGenerating(false);
      localStorage.setItem("savedChats", JSON.stringify(messages));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUserMessage(suggestion);
    handleSubmit({ preventDefault: () => {} });
  };

  const handleDeleteChat = () => {
    if (window.confirm("Are you sure you want to delete all messages?")) {
      localStorage.removeItem("savedChats");
      setMessages([]);
      setIsHeaderHidden(false);
    }
  };

  const copyMessage = (message) => {
    // const messageText = message.parentElement.querySelector(".text").innerText;

    navigator.clipboard.writeText(message);
    // You might want to add some visual feedback here
    // Revert the icon after 1 second
    // message.innerText = "done"
    // setTimeout(() => message.innerText = "copy_content", 1000);

  };
  
  return (
    <div className={`chatbot-container ${isHeaderHidden ? 'hide-header' : ''}`}>
      <header className="chatbot-header">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
        <h2 className="chatbot-title">Hello, there</h2>
        <h4 className="chatbot-subtitle">Looking for a recipe, or do you have some ingredients you'd like to use up?</h4>
        <ul className="chatbot-suggestion-list">
          <li className="chatbot-suggestion" onClick={() => handleSuggestionClick("Generate a recipe for me, I want to make something delicious for my family.")}>
            <h4 className="chatbot-text">Generate a recipe for me, I want to make something delicious for my family.</h4>
            <span className="chatbot-icon material-symbols-rounded">Ramen_Dining</span>
          </li>
          <li className="chatbot-suggestion" onClick={() => handleSuggestionClick("Generate a smart recipe from my inventory ingredients, I want to make use of them.")}>
            <h4 className="chatbot-text">Generate a smart recipe from my inventory ingredients, I want to make use of them.</h4>
            <span className="chatbot-icon material-symbols-rounded">Grocery</span>
          </li>
          <li className="chatbot-suggestion" onClick={() => handleSuggestionClick("How can I make use of my ingredient to make something healthy for kids?")}>
            <h4 className="chatbot-text">How can I make use of my ingredient to make something healthy for kids?</h4>
            <span className="chatbot-icon material-symbols-rounded">Egg_Alt</span>
          </li>
          <li className="chatbot-suggestion" onClick={() => handleSuggestionClick("Give me a list of easiest foods to make that smell heavenly and taste amazing.")}>
            <h4 className="chatbot-text">Give me a list of easiest foods to make that smell heavenly and taste amazing.</h4>
            <span className="chatbot-icon material-symbols-rounded">Fastfood</span>
          </li>
        </ul>
      </header>

      <div className="chatbot-chat-list" ref={chatListRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chatbot-message ${message.type} ${message.loading ? 'chatbot-loading' : ''}`}>
            <div className="chatbot-message-content">
              <img src={message.type === 'incoming' ? '/images/oldie.svg' : '/images/boy.svg'} alt="Avatar" className="chatbot-avatar" />
              <p className={`chatbot-text ${message.error ? 'chatbot-error' : ''}`}>
                {message.loading ? '' : message.text}
              </p>
              {message.loading && (
                <div className="chatbot-loading-indicator">
                  <div className="chatbot-loading-bar"></div>
                  <div className="chatbot-loading-bar"></div>
                  <div className="chatbot-loading-bar"></div>
                </div>
              )}
            </div>
            {!message.loading && (
              <span onClick={() => copyMessage(message.text)} className="chatbot-icon material-symbols-rounded">content_copy</span>
            //   {copied ? <span>check</span> : <span>content_copy</span>}
            )}
          </div>
        ))}
      </div>

      <div className="chatbot-typing-area">
        <form onSubmit={handleSubmit} className="chatbot-typing-form">
          <div className="chatbot-input-wrapper">
            <input 
              type="text" 
              placeholder="Enter your inquiry here" 
              className="chatbot-typing-input" 
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              required
            />
            <button type="submit" className="chatbot-icon material-symbols-rounded">send</button>
          </div>
          <div className="chatbot-action-buttons">
            <span onClick={handleDeleteChat} className="chatbot-icon material-symbols-rounded">delete</span>
          </div>
        </form>
        <p className="chatbot-disclaimer-text">
          Follow my instructions well so you can fill your tummy.
        </p>
      </div>
    </div>
  );
};

export default AIChatbot;