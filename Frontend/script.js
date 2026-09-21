const input = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask')

input?.addEventListener('keyup', handelEnter)
askBtn?.addEventListener('click', handelAsk)




function generate(text) {
    // append message to ui
    const msg = document.createElement('div');
    msg.className = `my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`
    msg.textContent = text
    chatContainer?.appendChild(msg);
    input.value = '';

    // Send it to LLM 

    // Append response to the UI

    
}

function handelEnter(e){
    if (e.key === 'Enter') {
        const text = input?.value.trim();
        if (!text) {
            return;
        }
        generate(text);
       
    }
}

function handelAsk(e) {
    const text = input?.value.trim();
    if (!text) {
        return;
    }
    generate(text)
}

