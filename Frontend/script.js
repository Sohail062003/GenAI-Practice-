const input = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container');
const askBtn = document.querySelector('#ask')

input?.addEventListener('keyup', handelEnter)
askBtn?.addEventListener('click', handelAsk)




async function generate(text) {
    // append message to ui
    const msg = document.createElement('div');
    msg.className = `my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`
    msg.textContent = text
    chatContainer?.appendChild(msg);
    input.value = '';

    // Send it to LLM 
    const assistantMessage = await callServer(text)
    console.log('assistantMessage', assistantMessage);


    // Append response to the UI
    const assistantMsgElem = document.createElement('div');
    assistantMsgElem.className = `max-w-fit`
    assistantMsgElem.textContent = assistantMessage
    chatContainer?.appendChild(assistantMsgElem);
    
}

async function callServer(inputText) {
    const response = await fetch('http://localhost:3001/chat', {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({ message: inputText }),
    });

    if (!response.ok) {
        throw new Error("Error generating the response")
    }

    const result = await response.json();
    return result.message;

}

async function handelEnter(e){
    if (e.key === 'Enter') {
        const text = input?.value.trim();
        if (!text) {
            return;
        }
        await generate(text);
       
    }
}

async function handelAsk(e) {
    const text = input?.value.trim();
    if (!text) {
        return;
    }
    await generate(text)
}

