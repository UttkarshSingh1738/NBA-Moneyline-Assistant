function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value;
    if (message.trim() !== "") {
        $.post("@routes.ChatroomController.send()", { username: "@username", message: message })
            .done(function() {
                const chatBox = document.getElementById('chat-box');
                const messageElement = document.createElement('div');
                messageElement.className = 'chat-message mb-2';
                messageElement.innerHTML = '<strong>@username</strong>: ' + message + ' <em>just now</em>';
                chatBox.appendChild(messageElement);
                chatInput.value = "";
                chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
            });
    }
}
function editMessage(messageId) {
    const messageElement = document.getElementById('message-' + messageId);
    const messageTextElement = messageElement.querySelector('.message-text');
    const messageText = messageTextElement.innerText;
    const newMessage = prompt("Edit your message:", messageText);
    $.post("@routes.ChatroomController.update()", { username: "@username", message: newMessage, id: messageId })
        .done(function() {
            messageTextElement.innerText = newMessage;
        });
}
function deleteMessage(messageId) {
    if (confirm("Are you sure you want to delete this message?")) {
        $.post("@routes.ChatroomController.destroy()", {id: messageId })
            .done(function() {
                const messageElement = document.getElementById('message-' + messageId);
                messageElement.remove();
            });
    }
}