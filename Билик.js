const API_KEY = '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';
const BASE_URL = 'https://openrouter.ai/api/v1'; 
const MODEL = 'x-ai/grok-4.1-fast'; 

let messagesHistory = [
  { role: 'system', content: 'Ты умный школьный помощник. Отвечай по-русски, просто, понятно, с примерами. Помогай с учёбой (математика, русский, история и т.д.) и жизнью (мотивация, планирование).' }
];

async function sendMessage() {
  const input = document.getElementById('user-input');
  const userText = input.value.trim();
  if (!userText) return;

  // Показываем сообщение пользователя сразу
  addMessage('user', userText);
  input.value = '';

  const thinkingMsg = addMessage('bot', 'КiРiВКА думает... 💭', 'thinking');

  messagesHistory.push({ role: 'user', content: userText });

  try {
    console.log('Отправляем запрос...'); // для отладки

    const response = await fetch(`${BASE_URL}/chat/completions`, {  // ← теперь правильно
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messagesHistory,
        temperature: 0.7
      })
    });

    console.log('Статус ответа:', response.status); // для отладки

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Данные от API:', data); // для отладки

    const reply = data.choices[0].message.content;

    thinkingMsg.classList.remove('thinking');
    thinkingMsg.textContent = reply;
    messagesHistory.push({ role: 'assistant', content: reply });
  } catch (error) {
    console.error('Ошибка:', error);
    thinkingMsg.classList.remove('thinking');
    thinkingMsg.textContent = `Ошибка: ${error.message}. Проверь консоль (F12) и API-ключ/модель.`;
  }
}

function addMessage(sender, text, extraClass = '') {
  const messages = document.getElementById('messages');
  const div = document.createElement('div');
  div.className = extraClass ? `${sender} ${extraClass}` : sender;
  div.textContent = text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}
function quickAsk(question) {
  document.getElementById('user-input').value = question;
  sendMessage();
}