const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  appendMessage('user', message);
  input.value = '';

  setLoading(true);

  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
  .then(response => response.json())
  .then(resp => {
    const { error, error_message, data } = resp;

    if (error !== 0) {
      throw new Error(error_message);
    }

    appendMessage('bot', data.answer);

    return;
  })
  .catch(error => {
    appendMessage('bot', 'Oops! Something went wrong. Please try again.');
    console.error('[API][POST][/api/chat]', error);
  })
  .finally(() => {
    setLoading(false);
  });
});

const originalPlaceholder = input.placeholder;
const originalButtonText = submitButton.innerHTML;

function setLoading(isLoading) {
  if (isLoading) {
    input.disabled = true;
    input.placeholder = 'thinking...';
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner"></span>';
  } else {
    input.disabled = false;
    input.placeholder = originalPlaceholder;
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
