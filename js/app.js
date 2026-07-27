/* =========================================================
   NOMAD MOTORS — FUNCIONES PRINCIPALES

   Este archivo controla:
   - Creación del catálogo
   - Filtros y ordenamiento
   - Vista rápida de cada modelo
   - Carrito lateral
   - Modo oscuro
   - Animaciones
   - Menú móvil
   - Modal de video
   ========================================================= */

/* ---------------------------------------------------------
   1. REFERENCIAS A ELEMENTOS DEL HTML
   Guardamos los elementos para utilizarlos en las funciones.
   --------------------------------------------------------- */
const productGrid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");

const cartDrawer = document.getElementById("cartDrawer");
const pageOverlay = document.getElementById("pageOverlay");
const openCartButton = document.getElementById("openCart");
const closeCartButton = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const quickView = document.getElementById("quickView");
const quickViewImage = document.getElementById("quickViewImage");
const quickViewCategory = document.getElementById("quickViewCategory");
const quickViewName = document.getElementById("quickViewName");
const quickViewPrice = document.getElementById("quickViewPrice");
const quickViewDescription = document.getElementById("quickViewDescription");
const quickViewSpecs = document.getElementById("quickViewSpecs");
const quickViewAdd = document.getElementById("quickViewAdd");

const videoModal = document.getElementById("videoModal");
const videoFrame = document.getElementById("videoFrame");
const toast = document.getElementById("toast");

/* ---------------------------------------------------------
   2. ESTADO DEL CARRITO

   localStorage permite conservar el carrito aunque recargues
   la página. Cambia "nomadMotorsCart" si deseas usar otro nombre.
   --------------------------------------------------------- */
let cart = JSON.parse(localStorage.getItem("nomadMotorsCart")) || [];
let selectedProductId = null;

/* Formatea precios automáticamente en pesos mexicanos. */
const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0
});

/* ---------------------------------------------------------
   3. CREAR EL CATÁLOGO

   Esta función lee los modelos desde data.js y crea las tarjetas.
   También aplica el filtro de categoría y el orden seleccionado.
   --------------------------------------------------------- */
function renderProducts() {
  const categoryValue = categoryFilter.value;
  const sortValue = sortFilter.value;

  /* Filtramos por Custom, Deportiva o Trial. */
  let visibleProducts = motorcycles.filter((product) => {
    return categoryValue === "all"
      ? true
      : product.category === categoryValue;
  });

  /* Ordenamos sin modificar el arreglo original. */
  visibleProducts = [...visibleProducts].sort((a, b) => {
    if (sortValue === "price-asc") return a.price - b.price;
    if (sortValue === "price-desc") return b.price - a.price;
    if (sortValue === "power-desc") return b.power - a.power;

    /* Orden original definido en data.js. */
    return a.id - b.id;
  });

  /* Creamos el HTML de cada tarjeta. */
  productGrid.innerHTML = visibleProducts.map((product) => `
    <article class="product-card reveal is-visible">
      <div class="product-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >
        <span class="product-tag">${product.tag}</span>
      </div>

      <div class="product-content">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>

        <div class="product-meta">
          <span>${product.power} HP</span>
          <span>${product.engine}</span>
          <span>${product.weight}</span>
        </div>

        <p class="product-price">${money.format(product.price)}</p>

        <div class="product-actions">
          <button class="add-button" data-add="${product.id}">
            Agregar al garage
          </button>

          <button
            data-view="${product.id}"
            aria-label="Vista rápida de ${product.name}"
          >
            Ver
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

/* ---------------------------------------------------------
   4. GUARDAR EL CARRITO
   Se ejecuta después de agregar, quitar o cambiar cantidades.
   --------------------------------------------------------- */
function saveCart() {
  localStorage.setItem("nomadMotorsCart", JSON.stringify(cart));
}

/* ---------------------------------------------------------
   5. AGREGAR UN MODELO AL CARRITO
   Si ya existe, aumenta su cantidad.
   --------------------------------------------------------- */
function addToCart(productId) {
  const product = motorcycles.find((item) => item.id === productId);

  if (!product) return;

  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} agregada al garage`);
}

/* ---------------------------------------------------------
   6. CAMBIAR CANTIDADES
   change puede ser 1 para sumar o -1 para restar.
   --------------------------------------------------------- */
function updateQuantity(productId, change) {
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  item.quantity += change;

  /* Si llega a cero, eliminamos el producto. */
  if (item.quantity <= 0) {
    cart = cart.filter((cartItem) => cartItem.id !== productId);
  }

  saveCart();
  renderCart();
}

/* Elimina completamente un modelo del carrito. */
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveCart();
  renderCart();
}

/* ---------------------------------------------------------
   7. MOSTRAR EL CARRITO
   Calcula unidades, productos y total estimado.
   --------------------------------------------------------- */
function renderCart() {
  const totalUnits = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);

  cartCount.textContent = totalUnits;

  cartItemsContainer.innerHTML = cart.map((item) => {
    const product = motorcycles.find(
      (motorcycle) => motorcycle.id === item.id
    );

    if (!product) return "";

    return `
      <article class="cart-item">
        <img src="${product.image}" alt="${product.name}">

        <div class="cart-item-info">
          <h3>${product.name}</h3>
          <p>${money.format(product.price)}</p>

          <div class="quantity-controls">
            <button
              data-minus="${product.id}"
              aria-label="Quitar una unidad"
            >
              −
            </button>

            <strong>${item.quantity}</strong>

            <button
              data-plus="${product.id}"
              aria-label="Agregar una unidad"
            >
              +
            </button>
          </div>
        </div>

        <button
          class="remove-item"
          data-remove="${product.id}"
          aria-label="Eliminar del carrito"
        >
          ✕
        </button>
      </article>
    `;
  }).join("");

  /* Sumamos precio por cantidad de cada modelo. */
  const totalPrice = cart.reduce((sum, item) => {
    const product = motorcycles.find(
      (motorcycle) => motorcycle.id === item.id
    );

    return product
      ? sum + product.price * item.quantity
      : sum;
  }, 0);

  cartTotal.textContent = money.format(totalPrice);

  /* Alternamos entre lista o mensaje de carrito vacío. */
  cartEmpty.hidden = cart.length > 0;
  cartItemsContainer.hidden = cart.length === 0;
}

/* ---------------------------------------------------------
   8. ABRIR Y CERRAR EL CARRITO LATERAL
   --------------------------------------------------------- */
function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  pageOverlay.classList.add("visible");
  document.body.classList.add("no-scroll");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  pageOverlay.classList.remove("visible");
  document.body.classList.remove("no-scroll");
}

/* ---------------------------------------------------------
   9. VISTA RÁPIDA
   Carga datos del modelo seleccionado dentro del modal.
   --------------------------------------------------------- */
function openQuickView(productId) {
  const product = motorcycles.find((item) => item.id === productId);

  if (!product) return;

  selectedProductId = productId;

  quickViewImage.src = product.image;
  quickViewImage.alt = product.name;
  quickViewCategory.textContent = product.category;
  quickViewName.textContent = product.name;
  quickViewPrice.textContent = money.format(product.price);
  quickViewDescription.textContent = product.description;

  quickViewSpecs.innerHTML = `
    <div class="spec">
      <strong>${product.power} HP</strong>
      <span>Potencia</span>
    </div>

    <div class="spec">
      <strong>${product.engine}</strong>
      <span>Motor</span>
    </div>

    <div class="spec">
      <strong>${product.weight}</strong>
      <span>Peso</span>
    </div>

    <div class="spec">
      <strong>${product.topSpeed}</strong>
      <span>Velocidad</span>
    </div>
  `;

  quickView.showModal();
}

/* ---------------------------------------------------------
   10. MENSAJE FLOTANTE
   Cambia 2200 para modificar cuántos milisegundos aparece.
   --------------------------------------------------------- */
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(showToast.timeout);

  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2200);
}

/* ---------------------------------------------------------
   11. MODO CLARO Y OSCURO
   La preferencia queda guardada en localStorage.
   --------------------------------------------------------- */
function setupTheme() {
  const savedTheme = localStorage.getItem("nomadMotorsTheme");

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  }

  document
    .getElementById("themeToggle")
    .addEventListener("click", () => {
      document.body.classList.toggle("dark");

      localStorage.setItem(
        "nomadMotorsTheme",
        document.body.classList.contains("dark")
          ? "dark"
          : "light"
      );
    });
}

/* ---------------------------------------------------------
   12. ANIMACIONES AL HACER SCROLL
   IntersectionObserver detecta cuándo una sección es visible.
   --------------------------------------------------------- */
function setupRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.14
  });

  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}

/* ---------------------------------------------------------
   13. EVENTOS DEL CATÁLOGO
   Usamos data-add y data-view para saber qué botón se pulsó.
   --------------------------------------------------------- */
productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  const viewButton = event.target.closest("[data-view]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
  }

  if (viewButton) {
    openQuickView(Number(viewButton.dataset.view));
  }
});

/* Eventos de los botones dentro del carrito. */
cartItemsContainer.addEventListener("click", (event) => {
  const minusButton = event.target.closest("[data-minus]");
  const plusButton = event.target.closest("[data-plus]");
  const removeButton = event.target.closest("[data-remove]");

  if (minusButton) {
    updateQuantity(Number(minusButton.dataset.minus), -1);
  }

  if (plusButton) {
    updateQuantity(Number(plusButton.dataset.plus), 1);
  }

  if (removeButton) {
    removeFromCart(Number(removeButton.dataset.remove));
  }
});

/* Abrir y cerrar carrito. */
openCartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
pageOverlay.addEventListener("click", closeCart);

/* Actualizar catálogo cuando cambian los filtros. */
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

/* Cerrar vista rápida. */
document
  .getElementById("closeQuickView")
  .addEventListener("click", () => quickView.close());

/* Agregar desde la vista rápida y abrir el carrito. */
quickViewAdd.addEventListener("click", () => {
  if (selectedProductId !== null) {
    addToCart(selectedProductId);
  }

  quickView.close();
  openCart();
});

/* ---------------------------------------------------------
   14. VIDEO PROMOCIONAL
   EDITA AQUÍ: reemplaza la URL por otro video de YouTube.
   Debe conservar el formato /embed/VIDEO_ID.
   --------------------------------------------------------- */
document.querySelectorAll("[data-video-open]").forEach((button) => {
  button.addEventListener("click", () => {
    videoFrame.src =
      "https://www.youtube.com/embed/3I4QfIYW7r8?autoplay=1";

    videoModal.showModal();
  });
});

document
  .getElementById("closeVideo")
  .addEventListener("click", () => {
    videoModal.close();
    videoFrame.src = "";
  });

videoModal.addEventListener("close", () => {
  videoFrame.src = "";
});

/* Botón final de compra: actualmente solo es demostrativo. */
document
  .getElementById("checkoutButton")
  .addEventListener("click", () => {
    showToast(
      "Demo: Este boton no realiza funciones es solo demostrativo"
    );
  });

/* Formulario de newsletter: no envía datos a un servidor todavía. */
document
  .getElementById("newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.getElementById("newsletterMessage");

    message.textContent =
      "Registro completado. Bienvenido a NOMAD.";

    event.target.reset();
  });

/* ---------------------------------------------------------
   15. MENÚ MÓVIL
   --------------------------------------------------------- */
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );
});

/* Cierra el menú al elegir una sección. */
mobileNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

/* La tecla Escape también cierra el carrito. */
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    cartDrawer.classList.contains("open")
  ) {
    closeCart();
  }
});

/* ---------------------------------------------------------
   16. INICIALIZACIÓN
   Estas funciones se ejecutan al cargar la página.
   --------------------------------------------------------- */
renderProducts();
renderCart();
setupTheme();
setupRevealAnimations();
