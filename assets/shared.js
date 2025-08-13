// Shared uploader + email-capture logic
(function(){
  const fileInput = document.getElementById('file');
  const info = document.getElementById('fileInfo');
  const emailCapture = document.getElementById('emailCapture');
  const workEmail = document.getElementById('workEmail');
  const btnSaveEmail = document.getElementById('btnSaveEmail');
  const emailMsg = document.getElementById('emailMsg');
  const ctaConvert = document.getElementById('ctaConvert');

  function isCorporateEmail(email){
    if(!email || !email.includes('@')) return false;
    const blocked = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','aol.com','gmx.com','proton.me','protonmail.com','mail.ru','yandex.ru','bk.ru','list.ru','inbox.ru'];
    const domain = email.split('@').pop().toLowerCase();
    if(blocked.includes(domain)) return false;
    if(!domain.includes('.')) return false;
    return true;
  }

  function showEmailCapture(){
    if(!emailCapture) return;
    emailCapture.style.display = 'block';
    const saved = localStorage.getItem('workEmail');
    if(saved && workEmail && !workEmail.value) workEmail.value = saved;
    if(emailMsg) emailMsg.textContent = '';
  }

  if (fileInput && info) {
    fileInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files && files.length) {
        const names = Array.from(files).map(f => `${f.name} (${Math.round(f.size/1024)} KB)`).join(', ');
        info.textContent = `Selected: ${names}`;
        showEmailCapture();
      }
    });
  }

  btnSaveEmail?.addEventListener('click', (e) => {
    e.preventDefault();
    const val = (workEmail?.value || '').trim();
    if(!isCorporateEmail(val)){
      if(emailMsg){
        emailMsg.style.color = '#b91c1c';
        emailMsg.textContent = 'Нужен корпоративный e‑mail (домен компании, не публичный почтовик).';
      }
      return;
    }
    localStorage.setItem('workEmail', val);
    if(emailMsg){
      emailMsg.style.color = '#16a34a';
      emailMsg.textContent = `Ок! Отправим результат на ${val}.`;
    }
  });

  ctaConvert?.addEventListener('click', (e) => {
    e.preventDefault();
    if(!fileInput || !info) return;
    const files = fileInput.files;
    if(!files || !files.length){
      info.textContent = fileInput.multiple ? 'Пожалуйста, выберите файлы инвойсов.' : 'Пожалуйста, выберите файл инвойса.';
      return;
    }
    const val = (workEmail?.value || '').trim() || localStorage.getItem('workEmail') || '';
    if(!isCorporateEmail(val)){
      showEmailCapture();
      if(emailMsg){
        emailMsg.style.color = '#b91c1c';
        emailMsg.textContent = 'Укажите корпоративный e‑mail, чтобы получить результат.';
      }
      workEmail?.focus();
      return;
    }
    const btn = ctaConvert;
    const prev = btn.textContent;
    btn.textContent = 'Processing…';
    btn.setAttribute('aria-busy','true');
    btn.style.pointerEvents = 'none';
    setTimeout(()=>{
      btn.textContent = prev;
      btn.removeAttribute('aria-busy');
      btn.style.pointerEvents = '';
      if(emailMsg){
        emailMsg.style.color = '#111827';
        emailMsg.textContent = `Готово! Мы отправим результат распознавания на ${val} после обработки.`;
      }
    }, 1200);
  });
})();


