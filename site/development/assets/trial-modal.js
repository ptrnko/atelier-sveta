(() => {
  const modal = document.getElementById("trial-modal");
  const form = document.getElementById("trial-form");
  const note = modal?.querySelector("[data-trial-note]");
  const submit = modal?.querySelector(".trial-submit");
  let lastFocus = null;
  let successModal = document.getElementById("success-modal");

  const ensureSuccessModal = () => {
    if (successModal) return successModal;
    successModal = document.createElement("div");
    successModal.className = "success-modal";
    successModal.id = "success-modal";
    successModal.setAttribute("aria-hidden", "true");
    successModal.innerHTML = `
      <div class="success-dialog" role="dialog" aria-modal="true" aria-labelledby="success-title">
        <button class="success-close" type="button" data-close-success aria-label="Закрити повідомлення">×</button>
        <img class="success-hand" src="./assets/hurts-hand.svg" alt="" aria-hidden="true">
        <h2 class="success-title" id="success-title">Дякуємо!</h2>
        <p class="success-text">Заявка відправлена. Ми зв'яжемося з вами найближчим часом.</p>
        <div class="success-actions">
          <button class="success-return" type="button" data-close-success>Повернутися на сайт <span class="btn-icon" aria-hidden="true"></span></button>
          <a class="success-return success-return--primary" href="./home.html#services" data-close-success>Обрати курс <span class="btn-icon" aria-hidden="true"></span></a>
        </div>
      </div>
    `;
    document.body.appendChild(successModal);
    return successModal;
  };

  const openModal = () => {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("modal-lock");
    window.setTimeout(() => modal.querySelector("input")?.focus(), 80);
  };

  const closeModal = ({ restoreFocus = true } = {}) => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("modal-lock");
    if (restoreFocus && lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  const openSuccess = () => {
    const popup = ensureSuccessModal();
    popup.classList.add("is-open");
    popup.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("modal-lock");
    window.setTimeout(() => popup.querySelector(".success-close")?.focus(), 80);
  };

  const closeSuccess = () => {
    if (!successModal) return;
    successModal.classList.remove("is-open");
    successModal.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("modal-lock");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  };

  document.addEventListener("click", (event) => {
    const opener = event.target.closest(".js-open-trial");
    if (opener) {
      event.preventDefault();
      openModal();
      return;
    }
    if (event.target.matches("[data-close-trial]") || event.target === modal) {
      closeModal();
      return;
    }
    if (event.target.matches("[data-close-success]") || event.target === successModal) {
      closeSuccess();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (modal?.classList.contains("is-open")) closeModal();
    if (successModal?.classList.contains("is-open")) closeSuccess();
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const endpoint = form.dataset.endpoint || form.action;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    if (note) note.textContent = "Відправляємо заявку...";
    if (submit) submit.disabled = true;

    fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Form submission failed");
        form.reset();
        closeModal({ restoreFocus: false });
        openSuccess();
      })
      .catch(() => {
        if (note) {
          note.textContent = "Не вдалося відправити форму. Напишіть нам напряму: Petrenkoag95@gmail.com";
        }
      })
      .finally(() => {
        if (submit) submit.disabled = false;
      });
  });
})();
