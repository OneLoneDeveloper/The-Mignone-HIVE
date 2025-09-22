(() => {
  const forms = document.querySelectorAll('form[data-contact-form]');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      // Use browser validation + Bootstrap styles
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      // JS-enhanced submit (no page reload)
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const spinner = form.querySelector('[data-spinner]');
      const okAlert = form.querySelector('[data-success]');
      const errAlert = form.querySelector('[data-error]');

      btn?.setAttribute('disabled', 'disabled');
      spinner?.classList.remove('d-none');
      okAlert?.classList.add('d-none');
      errAlert?.classList.add('d-none');

      const fd = new FormData(form);

      // IMPORTANT: do NOT overwrite ts here.
      // ts was set at render time to measure real time-to-fill for spam detection.

      const body = new URLSearchParams(fd);

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.ok) {
          okAlert?.classList.remove('d-none');
          form.reset();
          form.classList.remove('was-validated');
        } else {
          errAlert?.classList.remove('d-none');
        }
      } catch {
        errAlert?.classList.remove('d-none');
      } finally {
        btn?.removeAttribute('disabled');
        spinner?.classList.add('d-none');
      }
    }, false);
  });
})();