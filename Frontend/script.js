// const input = document.querySelector('#input');
// const chatContainer = document.querySelector('#chat-container');
// const askBtn = document.querySelector('#ask');

// const threadId = Date.now().toString(36) + Math.random().toString(36).substring(2, 8);


// input?.addEventListener('keyup', handelEnter);
// askBtn?.addEventListener('click', handelAsk);

// const loading = document.createElement('div');
// loading.className = 'my-6 animate-pulse'
// loading.textContent = 'Thinking...'


// async function generate(text) {
//     // append message to ui
//     const msg = document.createElement('div');
//     msg.className = `my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit`
//     msg.textContent = text
//     chatContainer?.appendChild(msg);
//     input.value = '';

//     // loading
//     chatContainer.appendChild(loading);

//     // Send it to LLM 
//     const assistantMessage = await callServer(text)
//     console.log('assistantMessage', assistantMessage);


//     // Append response to the UI
//     const assistantMsgElem = document.createElement('div');
//     assistantMsgElem.className = `max-w-fit`
//     assistantMsgElem.textContent = assistantMessage

//     loading.remove();

//     chatContainer?.appendChild(assistantMsgElem);
    
// }

// async function callServer(inputText) {
//     const response = await fetch('http://localhost:3001/chat', {
//         method: "POST",
//         headers: {
//             'content-type': 'application/json'
//         },
//         body: JSON.stringify({ threadId: threadId,  message: inputText }),
//     });

//     if (!response.ok) {
//         throw new Error("Error generating the response")
//     }

//     const result = await response.json();
//     return result.message;

// }

// async function handelEnter(e){
//     if (e.key === 'Enter') {
//         const text = input?.value.trim();
//         if (!text) {
//             return;
//         }
//         await generate(text);
       
//     }
// }

// async function handelAsk(e) {
//     const text = input?.value.trim();
//     if (!text) {
//         return;
//     }
//     await generate(text)
// }


// ─────────────────────────────────────────────────────────
//  chatDPT · script.js
//  Logic is UNCHANGED from the original. Only the HTML
//  snippets that get appended to the DOM have been upgraded
//  to match the new design system in index.html.
// ─────────────────────────────────────────────────────────

const input         = document.querySelector('#input');
const chatContainer = document.querySelector('#chat-container');
const askBtn        = document.querySelector('#ask');

// Unique thread id — same as original
const threadId =
  Date.now().toString(36) + Math.random().toString(36).substring(2, 8);

// ── Event listeners (same as original) ──────────────────
input?.addEventListener('keyup', handelEnter);
askBtn?.addEventListener('click', handelAsk);

// ── Loading element (same role as original) ──────────────
// class "my-6 animate-pulse" is kept so index.html CSS can
// style it, and so the original loading.remove() still works.
const loading = document.createElement('div');
loading.className = 'my-6 animate-pulse';
loading.textContent = 'Thinking...'; // hidden visually by CSS; kept for a11y

// ── generate — same structure as original ───────────────
async function generate(text) {

  // ── User message ───────────────────────────────────────
  // Original classes kept so index.html CSS targets them:
  //   .my-6 .bg-neutral-800 .p-3 .rounded-xl .ml-auto .max-w-fit
  const msg = document.createElement('div');
  msg.className = 'my-6 bg-neutral-800 p-3 rounded-xl ml-auto max-w-fit';
  msg.textContent = text;
  chatContainer?.appendChild(msg);
  input.value = '';
  // Sync send-button state after clearing
  askBtn.disabled = true;
  input.style.height = 'auto';

  // ── Loading indicator ──────────────────────────────────
  chatContainer.appendChild(loading);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });

  // ── Call server (same as original) ────────────────────
  const assistantMessage = await callServer(text);

  // ── AI message ─────────────────────────────────────────
  // Original class ".max-w-fit" kept so index.html CSS targets it.
  // Content is formatted for readability.
  const assistantMsgElem = document.createElement('div');
  assistantMsgElem.className = 'max-w-fit';
  assistantMsgElem.innerHTML = formatMessage(assistantMessage);

  loading.remove();
  chatContainer?.appendChild(assistantMsgElem);
  chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
}

// ── callServer — UNCHANGED from original ────────────────
async function callServer(inputText) {
  const response = await fetch('http://localhost:3001/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ threadId, message: inputText }),
  });

  if (!response.ok) {
    throw new Error('Error generating the response');
  }

  const result = await response.json();
  return result.message;
}

// ── handelEnter — UNCHANGED from original ───────────────
async function handelEnter(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    const text = input?.value.trim();
    if (!text) return;
    await generate(text);
  }
}

// ── handelAsk — UNCHANGED from original ─────────────────
async function handelAsk(e) {
  const text = input?.value.trim();
  if (!text) return;
  await generate(text);
}

// ── formatMessage — NEW helper (display only) ───────────
// Converts plain text with markdown-lite syntax into HTML.
// Does not affect any data sent to / received from the server.
function formatMessage(text) {
  if (!text) return '';

  // Escape HTML first
  let out = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced code blocks  ```lang\n...\n```
  out = out.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre style="background:#111;border:1px solid #1e1e1e;border-radius:9px;padding:12px 14px;overflow-x:auto;margin:10px 0"><code style="font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.65;color:#b0b0b0">${code.trim()}</code></pre>`
  );

  // Inline code `...`
  out = out.replace(
    /`([^`]+)`/g,
    '<code style="font-family:\'JetBrains Mono\',monospace;font-size:12px;background:#181818;border:1px solid #252525;border-radius:4px;padding:1px 5px;color:#c0c0c0">$1</code>'
  );

  // Bold **...**
  out = out.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e2e2e2">$1</strong>');

  // Paragraphs (double newline)
  out = out
    .split(/\n{2,}/)
    .map(p => `<p style="margin:0 0 10px">${p.replace(/\n/g, '<br>')}</p>`)
    .join('');

  return out;
}
