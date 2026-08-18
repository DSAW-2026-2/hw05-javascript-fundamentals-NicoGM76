import {
  validateEmail,
  validateMessage,
  validateName,
  validateRequestType,
  validateTerms
} from "./validation.js";

const searchInput = document.querySelector("#product-search");
const productCards = Array.from(document.querySelectorAll(".product-card"));
const resultsCount = document.querySelector("#results-count");
const emptyResults = document.querySelector("#empty-results");

const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#main-navigation");

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

const fields = {
  name: {
    element: document.querySelector("#name"),
    error: document.querySelector("#name-error"),
    validate: validateName
  },
  email: {
    element: document.querySelector("#email"),
    error: document.querySelector("#email-error"),
    validate: validateEmail
  },
  requestType: {
    element: document.querySelector("#request-type"),
    error: document.querySelector("#request-type-error"),
    validate: validateRequestType
  },
  message: {
    element: document.querySelector("#message"),
    error: document.querySelector("#message-error"),
    validate: validateMessage
  },
  terms: {
    element: document.querySelector("#terms"),
    error: document.querySelector("#terms-error"),
    validate: validateTerms
  }
};

function normalizeText(value) {
  return value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function updateProductFilter() {
  const query = normalizeText(searchInput.value);
  let visibleProducts = 0;

  productCards.forEach((card) => {
    const searchableText = normalizeText(card.dataset.search || card.textContent);
    const matches = searchableText.includes(query);

    card.hidden = !matches;

    if (matches) {
      visibleProducts += 1;
    }
  });

  resultsCount.textContent = visibleProducts === 1
    ? "1 producto"
    : `${visibleProducts} productos`;

  emptyResults.hidden = visibleProducts !== 0;
}

function setFieldState(field, message) {
  field.error.textContent = message;
  field.element.classList.toggle("input-error", message !== "");
  field.element.setAttribute("aria-invalid", message === "" ? "false" : "true");

  return message === "";
}

function validateField(fieldName) {
  const field = fields[fieldName];
  const value = field.element.type === "checkbox"
    ? field.element.checked
    : field.element.value;
  const message = field.validate(value);

  return setFieldState(field, message);
}

function validateForm() {
  return Object.keys(fields).map(validateField).every(Boolean);
}

function handleSubmit(event) {
  event.preventDefault();
  formStatus.textContent = "";
  formStatus.classList.remove("success-message");

  const isValid = validateForm();

  if (!isValid) {
    formStatus.textContent = "Revisa los campos marcados antes de enviar.";
    const firstInvalidField = Object.values(fields).find(
      (field) => field.element.getAttribute("aria-invalid") === "true"
    );

    if (firstInvalidField) {
      firstInvalidField.element.focus();
    }

    return;
  }

  formStatus.textContent = "Solicitud validada correctamente. No se enviaron datos a un servidor.";
  formStatus.classList.add("success-message");
  contactForm.reset();

  Object.keys(fields).forEach((fieldName) => {
    setFieldState(fields[fieldName], "");
  });
}

function toggleMenu() {
  const isOpen = navigation.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "Cerrar" : "Menú";
}

function handleKeyboardShortcut(event) {
  const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";

  if (isSearchShortcut) {
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  }

  if (event.key === "Escape" && document.activeElement === searchInput) {
    searchInput.value = "";
    updateProductFilter();
    searchInput.blur();
  }
}

searchInput.addEventListener("input", updateProductFilter);
menuButton.addEventListener("click", toggleMenu);
document.addEventListener("keydown", handleKeyboardShortcut);
contactForm.addEventListener("submit", handleSubmit);

Object.entries(fields).forEach(([fieldName, field]) => {
  const eventName = field.element.type === "checkbox" || field.element.tagName === "SELECT"
    ? "change"
    : "input";

  field.element.addEventListener(eventName, () => {
    validateField(fieldName);
    formStatus.textContent = "";
    formStatus.classList.remove("success-message");
  });
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "Menú";
  });
});

updateProductFilter();
