const contactIcons = {
  support:
    '<span class="material-symbols-rounded" aria-hidden="true">sign_language</span>',
  video:
    '<span class="material-symbols-rounded" aria-hidden="true">video_camera_front</span>',
  message: '<span class="material-symbols-rounded" aria-hidden="true">chat</span>',
  mail: '<span class="material-symbols-rounded" aria-hidden="true">mail</span>',
  send: '<span class="material-symbols-rounded" aria-hidden="true">send</span>',
  close: '<span class="material-symbols-rounded" aria-hidden="true">close</span>',
  back: '<span class="material-symbols-rounded" aria-hidden="true">arrow_back</span>',
};

export function Chat() {
  return `
    <aside class="chat-widget" aria-label="Chat with our team">
      <button class="button chat-widget__trigger" type="button" popovertarget="ayoub-chat-panel" aria-label="Chat with our team">
        <span class="chat-widget__avatar">${contactIcons.support}<span class="chat-widget__status" aria-hidden="true"></span></span>
        <span class="chat-widget__trigger-label" aria-hidden="true">Chat with our team</span>
      </button>
      <div class="chat-widget__panel" id="ayoub-chat-panel" popover aria-labelledby="ayoub-chat-heading">
        <div class="chat-widget__heading">
          <div class="chat-widget__profile">
            <span class="chat-widget__avatar">${contactIcons.support}</span>
            <span><strong id="ayoub-chat-heading">Deaf Safaris team</strong><small>Email or WhatsApp</small></span>
          </div>
          <button class="chat-widget__close" type="button" popovertarget="ayoub-chat-panel" popovertargetaction="hide" aria-label="Close contact options">${contactIcons.close}</button>
        </div>
        <p class="chat-widget__intro">Choose an option</p>
        <div class="chat-widget__start" data-chat-start>
          ${import.meta.env.DEV ? `<button class="chat-widget__start-option" type="button" data-chat-mode="live"><span class="chat-widget__start-icon">${contactIcons.video}</span><strong>Talk live</strong></button>` : ''}
          <button class="chat-widget__start-option" type="button" data-chat-mode="message"><span class="chat-widget__start-icon">${contactIcons.message}</span><strong>Send a message</strong></button>
        </div>
        <form class="chat-widget__live" id="live-support-request" hidden>
          <button class="chat-widget__back" type="button" data-chat-back>${contactIcons.back} Choose another option</button>
          <div class="chat-widget__live-heading"><strong>Talk live</strong></div>
          <label for="live-support-name">Your name</label>
          <input id="live-support-name" name="name" required maxlength="80" placeholder="Your name" />
          <div class="chat-widget__live-options" role="group" aria-label="Choose live support type">
            <label><input type="radio" name="type" value="chat" checked /> Live chat</label>
            <label><input type="radio" name="type" value="video" /> Video call</label>
          </div>
          <button class="button chat-widget__send" type="submit">Request live support ${contactIcons.send}</button>
          <p class="chat-widget__status-message" data-live-status role="status" aria-live="polite"></p>
        </form>
        <div class="chat-widget__message-flow" hidden>
          <button class="chat-widget__back" type="button" data-chat-back>${contactIcons.back} Choose another option</button>
          <p class="chat-widget__live-heading"><strong>Send a message</strong></p>
        <div class="chat-widget__channels" role="group" aria-label="Choose a contact channel">
          <button class="chat-widget__channel is-active" type="button" data-chat-channel="email" aria-pressed="true">${contactIcons.mail} Email</button>
          <button class="chat-widget__channel" type="button" data-chat-channel="whatsapp" aria-pressed="false">${contactIcons.message} WhatsApp</button>
        </div>
        <p class="chat-widget__recipient"><span>To</span><strong data-chat-recipient>Josephernesti82@gmail.com</strong></p>
        <form class="chat-widget__composer" id="chat-composer">
          <label for="chat-message">Your message</label>
          <textarea id="chat-message" rows="5" required placeholder="Write your email message here..."></textarea>
          <button class="button chat-widget__send" type="submit">Send ${contactIcons.send}</button>
          <p class="chat-widget__status-message" data-chat-status role="status" aria-live="polite"></p>
        </form>
        </div>
        <a class="chat-widget__brief" href="#enquiries">Prepare a safari brief first <span aria-hidden="true">→</span></a>
      </div>
    </aside>
  `;
}

export function initChat() {
  const panel = document.querySelector('#ayoub-chat-panel');
  const start = panel.querySelector('[data-chat-start]');
  const liveFlow = panel.querySelector('#live-support-request');
  const messageFlow = panel.querySelector('.chat-widget__message-flow');
  const modeButtons = [...panel.querySelectorAll('[data-chat-mode]')];
  const backButtons = [...panel.querySelectorAll('[data-chat-back]')];
  const liveForm = panel.querySelector('#live-support-request');
  const liveStatus = panel.querySelector('[data-live-status]');
  const composer = panel.querySelector('#chat-composer');
  const message = panel.querySelector('#chat-message');
  const status = panel.querySelector('[data-chat-status]');
  const recipient = panel.querySelector('[data-chat-recipient]');
  const channels = [...panel.querySelectorAll('[data-chat-channel]')];
  const brief = panel.querySelector('.chat-widget__brief');
  let channel = 'email';
  const recipients = {
    email: 'Josephernesti82@gmail.com',
    whatsapp: '+255 693 442 933',
  };
  const channelHandlers = new Map();
  const modeHandlers = new Map();
  const backHandler = () => {
    start.hidden = false;
    liveFlow.hidden = true;
    messageFlow.hidden = true;
  };
  modeButtons.forEach((button) => {
    const handler = () => {
      start.hidden = true;
      liveFlow.hidden = button.dataset.chatMode !== 'live';
      messageFlow.hidden = button.dataset.chatMode !== 'message';
    };
    modeHandlers.set(button, handler);
    button.addEventListener('click', handler);
  });
  backButtons.forEach((button) => button.addEventListener('click', backHandler));
  const setChannel = (nextChannel) => {
    channel = nextChannel;
    channels.forEach((button) => {
      const active = button.dataset.chatChannel === channel;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    recipient.textContent = recipients[channel];
    message.placeholder =
      channel === 'email'
        ? 'Write your email message here...'
        : 'Write your WhatsApp message here...';
    message.focus();
  };
  channels.forEach((button) => {
    const handler = () => setChannel(button.dataset.chatChannel);
    channelHandlers.set(button, handler);
    button.addEventListener('click', handler);
  });
  const send = (event) => {
    event.preventDefault();
    if (!message.value.trim()) return;
    const body = encodeURIComponent(message.value.trim());
    const subject = encodeURIComponent('Deaf Safaris enquiry');
    const url =
      channel === 'email'
        ? `https://mail.google.com/mail/?view=cm&fs=1&to=${recipients.email}&su=${subject}&body=${body}`
        : `https://wa.me/255693442933?text=${body}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    status.textContent =
      channel === 'email'
        ? 'Your email draft is ready. Review it and press Send.'
        : 'Your WhatsApp message is ready. Review it and press Send.';
  };
  const close = () => panel.hidePopover();
  const requestLiveSupport = async (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(liveForm));
    liveStatus.textContent = 'Sending your request...';
    try {
      const response = await fetch('/api/live-support/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Request failed.');
      liveStatus.textContent =
        values.type === 'video'
          ? 'Request received. Please keep this window open while we connect you.'
          : 'Request received. A team member can join the live chat soon.';
      liveForm.reset();
    } catch {
      liveStatus.textContent =
        'Live support is offline right now. Please use Email or WhatsApp below.';
    }
  };
  liveForm.addEventListener('submit', requestLiveSupport);
  composer.addEventListener('submit', send);
  brief.addEventListener('click', close);
  return () => {
    modeButtons.forEach((button) =>
      button.removeEventListener('click', modeHandlers.get(button)),
    );
    backButtons.forEach((button) => button.removeEventListener('click', backHandler));
    channels.forEach((button) =>
      button.removeEventListener('click', channelHandlers.get(button)),
    );
    composer.removeEventListener('submit', send);
    liveForm.removeEventListener('submit', requestLiveSupport);
    brief.removeEventListener('click', close);
  };
}
