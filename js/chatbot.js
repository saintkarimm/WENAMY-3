/**
 * Wenamy AI Chatbot Assistant
 * Answers user questions about the business using website content
 */

class WenamyChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.knowledgeBase = this.buildKnowledgeBase();
    this.init();
  }

  buildKnowledgeBase() {
    return {
      company: {
        name: "Wenamy Ghana",
        tagline: "Just Exceptional",
        description: "Premium real estate development company in Ghana with 10+ years of experience delivering exceptional residential and commercial properties.",
        location: "Tema Community 25, Greater Accra Region, Ghana",
        email: "info@wenamy.com",
        phone: ["0243 817 969", "0201 050 996"],
        whatsapp: "233243817969"
      },
      services: [
        { name: "Estate Development", description: "Creating premium residential and commercial properties with exceptional standards" },
        { name: "Building & Construction", description: "Quality construction services from foundation to finishing with precision" },
        { name: "Investment Portfolio", description: "Strategic real estate investment opportunities with excellent returns" },
        { name: "Architecture", description: "Innovative architectural designs that blend functionality with aesthetic appeal" },
        { name: "Interior Design", description: "Creating beautiful, functional interior spaces that reflect your style" },
        { name: "Consultancy", description: "Expert real estate and construction consultancy for informed decisions" }
      ],
      projects: [
        { name: "3 Bedroom Bungalow", type: "Apartments", price: "$83,000+", location: "Cantonments, Accra" },
        { name: "4 Bedroom House", type: "Apartments", price: "$250,000 - $280,000", location: "Eastlegon-Ogbojo, Accra" },
        { name: "5+2 Bedroom House", type: "Apartments", price: "$350,000", location: "Community 25, Tema" }
      ],
      faq: {
        "contact": "You can reach us at info@wenamy.com or call 0243 817 969 / 0201 050 996. You can also chat with us on WhatsApp!",
        "location": "We're located at Tema Community 25, Greater Accra Region, Ghana.",
        "whatsapp": "Chat with us on WhatsApp at +233 24 381 7969. Click the WhatsApp button in the footer!",
        "prices": "Our properties range from $83,000 for 3-bedroom bungalows to $350,000 for luxury 5-bedroom homes. Visit our Projects page for detailed pricing.",
        "payment": "We offer flexible payment plans. Contact us to discuss payment options that work for you.",
        "timeline": "Construction timelines vary by project. Typically, our off-plan properties take 12-18 months from purchase to completion."
      }
    };
  }

  init() {
    this.createChatWidget();
    this.attachEventListeners();
    this.initDragFunctionality();
    this.addWelcomeMessage();
  }

  initDragFunctionality() {
    const toggle = this.elements.toggleBtn;
    const widget = document.getElementById('wenamy-chatbot');
    let isDragging = false;
    let startX, startY, initialRight, initialBottom;
    let hasMoved = false;

    const onMouseDown = (e) => {
      if (this.isOpen) return;
      isDragging = true;
      hasMoved = false;
      startX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      startY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      const rect = widget.getBoundingClientRect();
      const parentRect = widget.offsetParent?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      initialRight = parentRect.width - rect.right;
      initialBottom = parentRect.height - rect.bottom;
      
      toggle.style.transition = 'none';
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
      
      const deltaX = startX - clientX;
      const deltaY = startY - clientY;
      
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        hasMoved = true;
      }
      
      const newRight = Math.max(10, Math.min(window.innerWidth - 60, initialRight + deltaX));
      const newBottom = Math.max(10, Math.min(window.innerHeight - 60, initialBottom + deltaY));
      
      widget.style.right = newRight + 'px';
      widget.style.bottom = newBottom + 'px';
    };

    const onMouseUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      toggle.style.transition = 'all 0.3s ease';
      
      if (!hasMoved) {
        this.toggleChat();
      }
    };

    toggle.addEventListener('mousedown', onMouseDown);
    toggle.addEventListener('touchstart', onMouseDown, { passive: true });
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove, { passive: true });
    
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchend', onMouseUp);
  }

  createChatWidget() {
    const widget = document.createElement('div');
    widget.id = 'wenamy-chatbot';
    widget.innerHTML = `
      <div class="chatbot-container">
        <div class="chatbot-header">
          <div class="chatbot-avatar">
            <img src="images/icons/logo.png" alt="Wenamy">
          </div>
          <div class="chatbot-info">
            <h4>Wenamy Assistant</h4>
            <span class="chatbot-status">Online</span>
          </div>
          <button class="chatbot-close" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="chatbot-messages"></div>
        <div class="chatbot-input-container">
          <input type="text" class="chatbot-input" placeholder="Ask about our properties..." maxlength="200">
          <button class="chatbot-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
      </div>
      <button class="chatbot-toggle" aria-label="Open chat">
        <img src="images/icons/logo.png" alt="Wenamy" class="chatbot-logo">
        <span class="chatbot-bubble">TALK TO ME</span>
      </button>
    `;
    document.body.appendChild(widget);
    this.elements = {
      container: widget.querySelector('.chatbot-container'),
      messages: widget.querySelector('.chatbot-messages'),
      input: widget.querySelector('.chatbot-input'),
      sendBtn: widget.querySelector('.chatbot-send'),
      toggleBtn: widget.querySelector('.chatbot-toggle'),
      closeBtn: widget.querySelector('.chatbot-close')
    };
  }

  attachEventListeners() {
    this.elements.closeBtn.addEventListener('click', () => this.toggleChat());
    this.elements.sendBtn.addEventListener('click', () => this.sendMessage());
    this.elements.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const widget = document.getElementById('wenamy-chatbot');
    widget.classList.toggle('chatbot-open', this.isOpen);
    
    if (this.isOpen) {
      this.elements.input.focus();
      this.hideNotification();
    }
  }

  hideNotification() {
    const notification = document.querySelector('.chatbot-notification');
    if (notification) notification.style.display = 'none';
  }

  addWelcomeMessage() {
    setTimeout(() => {
      this.addMessage('bot', `Hello! Welcome to ${this.knowledgeBase.company.name}. I'm here to help you with information about our properties, services, and more. How can I assist you today?`);
    }, 1000);
  }

  addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${sender}`;
    messageDiv.innerHTML = `
      <div class="message-bubble">${this.escapeHtml(text)}</div>
      <span class="message-time">${this.getCurrentTime()}</span>
    `;
    this.elements.messages.appendChild(messageDiv);
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    this.messages.push({ sender, text, time: new Date() });
  }

  sendMessage() {
    const text = this.elements.input.value.trim();
    if (!text) return;

    this.addMessage('user', text);
    this.elements.input.value = '';

    // Show typing indicator
    this.showTypingIndicator();

    // Generate response
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(text);
      this.addMessage('bot', response);
    }, 1000 + Math.random() * 500);
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chatbot-message bot typing';
    typingDiv.innerHTML = `
      <div class="message-bubble typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;
    this.elements.messages.appendChild(typingDiv);
    this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    this.typingElement = typingDiv;
  }

  hideTypingIndicator() {
    if (this.typingElement) {
      this.typingElement.remove();
      this.typingElement = null;
    }
  }

  generateResponse(userMessage) {
    const message = userMessage.toLowerCase();
    const kb = this.knowledgeBase;

    // Greetings
    if (this.matchesAny(message, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      return `Hello! Welcome to ${kb.company.name}. How can I help you today?`;
    }

    // Contact information
    if (this.matchesAny(message, ['contact', 'phone', 'email', 'reach', 'call', 'number'])) {
      return kb.faq.contact;
    }

    // Location
    if (this.matchesAny(message, ['location', 'address', 'where', 'find', 'located', 'office'])) {
      return kb.faq.location;
    }

    // WhatsApp
    if (this.matchesAny(message, ['whatsapp', 'chat', 'message', 'text'])) {
      return kb.faq.whatsapp;
    }

    // Services
    if (this.matchesAny(message, ['service', 'services', 'what do you do', 'offer', 'provide'])) {
      const servicesList = kb.services.map(s => `• ${s.name}: ${s.description}`).join('\n');
      return `We offer the following services:\n\n${servicesList}\n\nWould you like to know more about any specific service?`;
    }

    // Projects/Properties
    if (this.matchesAny(message, ['project', 'projects', 'property', 'properties', 'house', 'houses', 'home', 'homes', 'buy', 'available'])) {
      const projectsList = kb.projects.map(p => `• ${p.name} - ${p.price} (${p.location})`).join('\n');
      return `Here are some of our available properties:\n\n${projectsList}\n\nVisit our Projects page to see all available properties with detailed information and images.`;
    }

    // Pricing
    if (this.matchesAny(message, ['price', 'prices', 'cost', 'how much', 'pricing', 'payment'])) {
      return kb.faq.prices;
    }

    // Timeline
    if (this.matchesAny(message, ['time', 'timeline', 'how long', 'duration', 'when', 'completion'])) {
      return kb.faq.timeline;
    }

    // About company
    if (this.matchesAny(message, ['about', 'company', 'who are you', 'wenamy', 'background', 'history'])) {
      return `${kb.company.name} - ${kb.company.tagline}\n\n${kb.company.description}\n\nWe've been delivering exceptional spaces for over 10 years.`;
    }

    // Help
    if (this.matchesAny(message, ['help', 'what can you do', 'what do you know', 'assist'])) {
      return `I can help you with:\n• Information about our properties and projects\n• Our services (Estate Development, Construction, Architecture, etc.)\n• Contact details and location\n• Pricing information\n• General questions about Wenamy\n\nWhat would you like to know?`;
    }

    // Thank you
    if (this.matchesAny(message, ['thank', 'thanks', 'appreciate'])) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    // Goodbye
    if (this.matchesAny(message, ['bye', 'goodbye', 'see you', 'later'])) {
      return "Thank you for chatting with us! Feel free to reach out anytime. Have a great day!";
    }

    // Default response
    return "I'm not sure I understand. You can ask me about:\n• Our properties and projects\n• Services we offer\n• Contact information\n• Pricing\n• Or type 'help' to see what I can do";
  }

  matchesAny(message, keywords) {
    return keywords.some(keyword => message.includes(keyword));
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/\n/g, '<br>');
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
}

// Initialize chatbot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WenamyChatbot());
} else {
  new WenamyChatbot();
}
