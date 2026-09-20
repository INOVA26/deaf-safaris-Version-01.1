import { createBrief } from '../utils/createBrief.js';

export function Enquiry() {
  return `
    <section class="enquiry section-space" id="enquiries" aria-labelledby="enquiry-heading">
      <div class="container enquiry__grid">
        <div class="enquiry__intro">
          <p class="eyebrow">05 / Your adventure starts with an idea</p>
          <h2 id="enquiry-heading">Tell your<br /><em>next story.</em></h2>
          <p>Create a simple brief for the safari you have in mind. Keep it ready for a future conversation.</p>
          <p class="enquiry__notice">Contact details are awaiting confirmation. This tool creates a personal draft; it does not send an enquiry or make a booking.</p>
        </div>
        <div class="enquiry__panel">
          <form id="enquiry-form" aria-describedby="brief-privacy">
            <div class="form-heading"><h3>Your safari wish list</h3><span>All fields optional</span></div>
            <div class="form-grid">
              <div class="form-field">
                <label for="interest">What inspires you?</label>
                <select id="interest" name="interest">
                  <option value="">I'm open to ideas</option>
                  <option>Wildlife encounters</option>
                  <option>Wide-open landscapes</option>
                  <option>A slower kind of journey</option>
                  <option>A little of everything</option>
                </select>
              </div>
              <div class="form-field">
                <label for="travellers">How many travellers?</label>
                <input id="travellers" name="travellers" type="number" min="1" max="99" step="1" placeholder="e.g. 2" />
              </div>
              <div class="form-field form-field--wide">
                <label for="travel-window">When would you like to travel?</label>
                <input id="travel-window" name="travelWindow" type="text" maxlength="120" placeholder="A month, a season, or flexible dates" />
              </div>
              <div class="form-field form-field--wide">
                <label for="preferences">What would make the journey yours?</label>
                <textarea id="preferences" name="preferences" rows="4" maxlength="2000" placeholder="Your interests, preferred pace, questions, or communication preferences"></textarea>
              </div>
            </div>
            <p id="brief-privacy" class="form-hint">Your answers stay on this page. Nothing is sent or saved unless you download your brief.</p>
            <button class="button button--dark" type="submit">Create my brief <span aria-hidden="true">↗</span></button>
          </form>
          <div class="brief-result" id="brief-result" hidden>
            <h3 id="brief-heading" tabindex="-1">Your adventure, on paper.</h3>
            <p>This is your personal draft. It has not been sent.</p>
            <label for="brief-text">Your enquiry brief</label>
            <textarea id="brief-text" rows="10" readonly></textarea>
            <div class="brief-result__actions">
              <button class="button button--dark" type="button" id="download-brief">Download brief (.txt)</button>
              <button class="button button--quiet" type="button" id="edit-brief">Edit my answers</button>
            </div>
          </div>
          <p class="form-hint" id="brief-status" role="status" aria-live="polite"></p>
        </div>
      </div>
    </section>
  `;
}

export function initEnquiry() {
  const form = document.querySelector('#enquiry-form');
  const result = document.querySelector('#brief-result');
  const output = document.querySelector('#brief-text');
  const status = document.querySelector('#brief-status');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const answers = Object.fromEntries(new FormData(form));
    output.value = createBrief(answers);
    form.hidden = true;
    result.hidden = false;
    status.textContent = 'Your brief is ready. Nothing has been sent.';
    document.querySelector('#brief-heading').focus();
  });

  document.querySelector('#edit-brief').addEventListener('click', () => {
    result.hidden = true;
    form.hidden = false;
    status.textContent = '';
    document.querySelector('#interest').focus();
  });

  document.querySelector('#download-brief').addEventListener('click', () => {
    const file = new Blob([output.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'deaf-safaris-my-brief.txt';
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    status.textContent =
      'Download requested. Your brief has not been sent to Deaf Safaris.';
  });
}
