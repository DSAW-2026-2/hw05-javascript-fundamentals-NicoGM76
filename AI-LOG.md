# AI-LOG — HW05 JavaScript Fundamentals

## ¿Se utilizó IA?

Sí. Se utilizó ChatGPT para proponer una implementación en JavaScript vanilla que cumpliera la consigna de HW05, especialmente para el filtro en tiempo real, los selectores del DOM, los `addEventListener` y la separación de la validación en un módulo independiente.

## Prompt original

La consulta entregada a la IA fue la siguiente:

> # JavaScript Fundamentals
>
> Add real interactivity to your project page using vanilla JavaScript — no libraries, no frameworks.
>
> ## Entregables
>
> - `js/main.js` Main script — DOM manipulation, event listeners, form validation.
> - `js/validation.js` Client-side validation module — all validation logic isolated here.
>
> ## Capa 2 — Extensión
>
> Implement a real-time search/filter on any list on the page (at least 5 items) using only vanilla JS.
>
> ## Capa 3 — Bitácora de IA
>
> Did you use AI to help with a specific DOM selector or event listener? Paste the original AI code and your final version with the differences highlighted.
>
> Criterios:
> - All form fields validated client-side with visible inline error messages.
> - Real-time search/filter works on a list of 5+ items and updates on every keystroke.
> - Zero dependencies, vanilla JS only.

También se proporcionó el enlace del repositorio de GitHub Classroom para revisar la rúbrica real.

## Código original propuesto por IA

La primera idea para el filtro fue una versión mínima:

```js
const search = document.querySelector("#product-search");
const items = document.querySelectorAll(".product-card");

search.addEventListener("input", () => {
  const text = search.value.toLowerCase();

  items.forEach((item) => {
    item.style.display = item.textContent.toLowerCase().includes(text)
      ? "block"
      : "none";
  });
});
```

## Versión final utilizada

```js
const searchInput = document.querySelector("#product-search");
const productCards = Array.from(document.querySelectorAll(".product-card"));

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

searchInput.addEventListener("input", updateProductFilter);
```

## Diferencias destacadas

- **Selector:** se mantuvo `querySelectorAll(".product-card")`, pero se convirtió el resultado a un arreglo con `Array.from(...)`.
- **Evento:** se mantuvo `addEventListener("input", ...)` porque `input` permite actualizar el filtro en cada pulsación.
- **Visibilidad:** se cambió `style.display` por la propiedad semántica `hidden`.
- **Búsqueda:** se agregó `normalizeText()` para que la comparación no falle por mayúsculas o tildes.
- **Datos:** se agregó `data-search` para incluir nombre, categoría y palabras clave.
- **DOM adicional:** se añadió un contador de productos visibles y un mensaje cuando no existen coincidencias.
- **Accesibilidad:** el contador usa `aria-live="polite"` para anunciar cambios sin interrumpir al usuario.

## Parte que no entendí inmediatamente

La parte menos evidente fue el uso de:

```js
.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
```

`normalize("NFD")` separa las letras de sus marcas diacríticas y la expresión regular elimina esas marcas. De esta forma, una búsqueda como `acetaminofen` puede coincidir con `Acetaminofén`.

## Qué se cambió después de probarlo y por qué

La versión final no solo oculta o muestra tarjetas. También cuenta resultados, muestra un estado vacío, admite tildes, incorpora el atajo `Ctrl + K` solicitado por la rúbrica del repositorio y mantiene toda la validación en `js/validation.js`.

La validación final se ejecuta tanto mientras el usuario edita como al intentar enviar el formulario. Si existe un error, se muestra debajo del campo correspondiente y el formulario no continúa.
