const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value) {
  const cleanedValue = value.trim();

  if (cleanedValue === "") {
    return "El nombre es obligatorio.";
  }

  if (cleanedValue.length < 3) {
    return "El nombre debe tener al menos 3 caracteres.";
  }

  return "";
}

export function validateEmail(value) {
  const cleanedValue = value.trim();

  if (cleanedValue === "") {
    return "El correo electrónico es obligatorio.";
  }

  if (!emailPattern.test(cleanedValue)) {
    return "Ingresa un correo electrónico válido.";
  }

  return "";
}

export function validateRequestType(value) {
  if (value === "") {
    return "Selecciona un tipo de solicitud.";
  }

  return "";
}

export function validateMessage(value) {
  const cleanedValue = value.trim();

  if (cleanedValue === "") {
    return "El mensaje es obligatorio.";
  }

  if (cleanedValue.length < 10) {
    return "El mensaje debe tener al menos 10 caracteres.";
  }

  return "";
}

export function validateTerms(checked) {
  if (!checked) {
    return "Debes aceptar el tratamiento de datos.";
  }

  return "";
}
