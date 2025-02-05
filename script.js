const chatMessages = document.getElementById('corrected-text');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('submit-btn');

async function generateResponse(prompt) {
    const response = await fetch('http://localhost:3000/chat', { 
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
        throw new Error('API Error');
    }

    const data = await response.json();
    return data.response;
}

function cleanMarkdown(text) {
    return text.replace(/#{1,6}\s?/g, '').replace(/\*\*/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

function addMessage(message) {
    const MAX_LENGTH = message.length; 

    if (message.length > MAX_LENGTH) {
        message = message.substring(0, MAX_LENGTH) + "..."; // Truncate and add ellipsis
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


async function handleUserInput() {
    const userMessage = userInput.value.trim();

    if (userMessage) {
        sendButton.disabled = true;
        userInput.disabled = true;

        try {
            const botMessage = await generateResponse(userMessage);
            addMessage(cleanMarkdown(botMessage));
        } catch (error) {
            console.error('Error:', error);
            addMessage('An error occurred. Please try again.');
        } finally {
            sendButton.disabled = false;
            userInput.disabled = false;
            userInput.focus();
        }
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});
