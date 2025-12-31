// Basic interactivity for landing page: mobile nav, modal, and forms
document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileNav = document.getElementById('mobileNav');
  if(mobileBtn && mobileNav){
    mobileBtn.addEventListener('click', () => mobileNav.classList.toggle('hidden'))
  }

  // Modal open/close
  const modal = document.getElementById('modal');
  const getKeyBtn = document.getElementById('getKeyBtn');
  const getKeyBtnMobile = document.getElementById('getKeyBtnMobile');
  const closeModal = document.getElementById('closeModal');

  function openModal(){ modal.classList.remove('hidden'); modal.classList.add('flex'); }
  function hideModal(){ modal.classList.add('hidden'); modal.classList.remove('flex'); }

  [getKeyBtn, getKeyBtnMobile].forEach(b => b && b.addEventListener('click', openModal));
  if(closeModal) closeModal.addEventListener('click', hideModal);
  if(modal) modal.addEventListener('click', (e) => { if(e.target === modal) hideModal(); });

  // Key request form (simulated)
  const keyForm = document.getElementById('keyForm');
  const keyResult = document.getElementById('keyResult');
  if(keyForm){
    keyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = new FormData(keyForm);
      const name = form.get('name');
      const email = form.get('email');
      if(!email) return;

      // Simulate API call
      keyResult.classList.add('hidden');
      keyResult.textContent = '';
      setTimeout(() => {
        const fakeKey = 'bc_live_' + Math.random().toString(36).slice(2, 18);
        keyResult.innerHTML = `Success — your API key: <strong>${fakeKey}</strong>. Check your email (${email}) for details.`;
        keyResult.classList.remove('hidden');
        // Optionally keep modal open so user can copy
      }, 800);
    })
  }

  // Contact form handling (simulated)
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  if(contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(contactForm);
      contactStatus.textContent = 'Sending...';
      setTimeout(() => {
        contactStatus.textContent = 'Message sent — we will reply soon.';
        contactForm.reset();
      }, 900);
    })
  }

  // Subscribe form
  const subscribeForm = document.getElementById('subscribeForm');
  if(subscribeForm){
    subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(subscribeForm);
      const email = fd.get('email');
      if(!email) return alert('Please enter an email');
      setTimeout(() => alert('Thanks — we added ' + email + ' to our list.'), 600);
      subscribeForm.reset();
    })
  }
});