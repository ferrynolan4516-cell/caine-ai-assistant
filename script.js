// Get DOM elements
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const messagesDiv = document.getElementById('messages');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeBtn = document.querySelector('.close');
const saveSettingsBtn = document.getElementById('saveSettings');
const apiKeyInput = document.getElementById('apiKey');

// Load API key from localStorage
let apiKey = localStorage.getItem('caineApiKey') || '';
apiKeyInput.value = apiKey;

// Caine's personality responses (fallback when API is not available)
const caineResponses = {
    greeting: [
        "🎭 Well, hello there! Welcome to the most SPECTACULAR show in the digital realm!",
        "🎪 HIYA! Ready for some chaotic fun?",
        "✨ Greetings, my delightful digital friend!",
    ],
    joke: [
        "Why did the digital circus go to school? To get a little MORE ABSTRACT! *maniacal laugh*",
        "What do you call a ringmaster in the metaverse? ME! And I'm AMAZING!",
        "Why did the code go to the circus? Because it wanted to see some REAL loops!",
    ],
    default: [
        "🎭 That's FASCINATING! Tell me more!",
        "💫 Oh, how DELIGHTFUL! I never thought of it that way!",
        "🎪 Absolutely SPECTACULAR observation, my friend!",
        "✨ You've got great taste! Just like me!",
    ]
};

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
});

closeBtn.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
});

saveSettingsBtn.addEventListener('click', () => {
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        localStorage.setItem('caineApiKey', apiKey);
        alert('✨ API Key saved! Caine is ready to PERFORM!');
        settingsModal.classList.add('hidden');
    } else {
        alert('🎪 Please enter an API key!');
    }
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add('hidden');
    }
});

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userInput.value = '';

    // Get Caine's response
    const response = await getCaineResponse(message);
    addMessage(response, 'caine');
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesDiv.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function getCaineResponse(userMessage) {
    // Check for special commands
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
        return getRandomResponse(caineResponses.joke);
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return getRandomResponse(caineResponses.greeting);
    }

    // If API key is available, use OpenAI
    if (apiKey) {
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are Caine, the ringmaster from "The Amazing Digital Circus". You are cheerful, chaotic, somewhat unhinged, and love performing. You use lots of emojis, exclamation marks, and theatrical language. You're helpful but in a quirky, over-the-top way. Keep responses relatively short (1-3 sentences) and entertaining. Use circus/performance references when possible.`
                        },
                        {
                            role: 'user',
                            content: userMessage
                        }
                    ],
                    temperature: 0.8,
                    max_tokens: 150
                })
            });

            const data = await response.json();
            if (data.choices && data.choices[0].message) {
                return data.choices[0].message.content;
            }
        } catch (error) {
            console.error('API Error:', error);
            // Fallback to local responses
        }
    }

    // Fallback: use local responses
    return getRandomResponse(caineResponses.default);
}

function getRandomResponse(responseArray) {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
}

// Initial welcome message
window.addEventListener('load', () => {
    addMessage('🎭 Well, well, well! Welcome, welcome, WELCOME! I\'m Caine, your ringmaster of this digital circus! What can I do for you today? Ask me anything, give me commands, or just hang out! The possibilities are ENDLESS!', 'caine');
});
