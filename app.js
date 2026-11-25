"use strict";

const WHATSAPP_NUMBER = "5514997220907";
const BUSINESS_NAME = "Lanches Do Nezão";
const DELIVERY_FEE = 5;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80";
const CATEGORIES = ["Todos", "Lanches", "Pastéis", "Porções", "Bebidas"];
const EXTRAS = [
  { name: "Catupiry", price: 3 },
  { name: "Bacon", price: 4 },
  { name: "Cheddar", price: 3 },
  { name: "Maionese Caseira Extra", price: 0 }
];
const PRODUCTS = [
  { id: "x-burguer", name: "X-Burguer", category: "Lanches", description: "Pão, hambúrguer, queijo, alface, tomate e maionese.", price: 18, imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80", badge: "Mais pedido" },
  { id: "x-salada", name: "X-Salada", category: "Lanches", description: "Pão, hambúrguer, queijo, alface, tomate e maionese.", price: 20, imagem: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=800&q=80" },
  { id: "x-bacon", name: "X-Bacon", category: "Lanches", description: "Hambúrguer, queijo, bacon crocante, alface e tomate.", price: 23, imagem: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80", badge: "Sai na hora" },
  { id: "x-tudo", name: "X-Tudo", category: "Lanches", description: "Hambúrguer, queijo, presunto, ovo, bacon e salada.", price: 27, imagem: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80" },
  { id: "pastel-carne", name: "Pastel de Carne", category: "Pastéis", description: "Massa crocante recheada com carne temperada.", price: 10, imagem: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80", badge: "Sai na hora" },
  { id: "pastel-queijo", name: "Pastel de Queijo", category: "Pastéis", description: "Queijo derretido em massa sequinha e crocante.", price: 10, imagem: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=800&q=80" },
  { id: "pastel-pizza", name: "Pastel de Pizza", category: "Pastéis", description: "Queijo, presunto, tomate e orégano.", price: 12, imagem: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=800&q=80" },
  { id: "batata-simples", name: "Batata Frita Simples", category: "Porções", description: "Porção de batata frita sequinha com sal.", price: 18, imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80" },
  { id: "batata-cheddar-bacon", name: "Batata com Cheddar e Bacon", category: "Porções", description: "Batata frita coberta com cheddar cremoso e bacon.", price: 28, imagem: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=800&q=80", badge: "Pra dividir" },
  { id: "refri-lata", name: "Refrigerante Lata", category: "Bebidas", description: "Lata 350 ml · consulte os sabores disponíveis.", price: 6, imagem: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?auto=format&fit=crop&w=800&q=80" },
  { id: "suco", name: "Suco", category: "Bebidas", description: "Suco gelado · consulte os sabores disponíveis.", price: 8, imagem: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80" }
];

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const menuGrid = document.querySelector("#menu-grid");
const filters = document.querySelector("#category-filters");
const menuSearch = document.querySelector("#menu-search");
const modal = document.querySelector("#product-modal");
const customizeForm = document.querySelector("#customize-form");
const cartItemsElement = document.querySelector("#cart-items");
const mobileCartBar = document.querySelector("#mobile-cart-bar");
const cart = [];
let selectedCategory = "Todos";
let selectedProduct = null;

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeProductImage(product, className) {
  const image = makeElement("img", className);
  image.src = product.imagem;
  image.alt = product.name;
  image.loading = "lazy";
  image.decoding = "async";
  image.setAttribute("onerror", `this.onerror=null;this.src='${FALLBACK_IMAGE}';`);
  return image;
}

function normalizeSearchText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function updateBusinessStatus(now = new Date()) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const isOpenDay = day === 0 || (day >= 2 && day <= 6);
  const isOpen = isOpenDay && minutes >= 18 * 60 + 30 && minutes < 24 * 60;
  const status = document.querySelector("#business-status");

  status.textContent = isOpen ? "ABERTO AGORA NA PRAÇA" : "FECHADO • ABRE ÀS 18:30";
  status.classList.toggle("bg-[#2A9D8F]", isOpen);
  status.classList.toggle("bg-[#E63946]", !isOpen);
}

function renderFilters() {
  filters.replaceChildren();
  CATEGORIES.forEach((category) => {
    const button = makeElement("button", "min-h-11 shrink-0 rounded-lg border px-5 text-sm font-bold tracking-wide transition-all");
    button.type = "button";
    button.textContent = category;
    button.setAttribute("aria-pressed", String(category === selectedCategory));
    button.classList.toggle("border-[#FCA311]", category === selectedCategory);
    button.classList.toggle("bg-[#FCA311]", category === selectedCategory);
    button.classList.toggle("text-[#141210]", category === selectedCategory);
    button.classList.toggle("border-[#332E28]", category !== selectedCategory);
    button.classList.toggle("bg-[#1F1C18]", category !== selectedCategory);
    button.classList.toggle("text-[#A8A29E]", category !== selectedCategory);
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderFilters();
      renderProducts();
    });
    filters.append(button);
  });
}

function renderProducts() {
  menuGrid.replaceChildren();
  const categoryProducts = selectedCategory === "Todos"
    ? PRODUCTS
    : PRODUCTS.filter((product) => product.category === selectedCategory);
  const query = normalizeSearchText(menuSearch.value.trim());
  const visibleProducts = categoryProducts.filter((product) => {
    const searchableText = normalizeSearchText(`${product.name} ${product.description} ${product.category}`);
    return searchableText.includes(query);
  });

  if (visibleProducts.length === 0) {
    menuGrid.append(makeElement("p", "rounded-xl border border-[#332E28] bg-[#1F1C18] p-5 text-sm font-semibold text-[#A8A29E] sm:col-span-2 lg:col-span-3", "Nenhum item encontrado. Tente outro termo ou categoria."));
    return;
  }

  visibleProducts.forEach((product) => {
    const card = makeElement("article", "group flex min-h-80 flex-col overflow-hidden rounded-2xl border border-[#332E28] bg-[#1F1C18] shadow-[0_12px_30px_rgba(0,0,0,0.22)]");
    const imageContainer = makeElement("div", "relative h-44 overflow-hidden bg-[#141210]");
    imageContainer.append(makeProductImage(product, "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"));
    if (product.badge) {
      const badge = makeElement("span", "absolute right-3 top-3 rounded-md border border-[#332E28] bg-[#E63946] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#FAF7F2]", product.badge);
      imageContainer.append(badge);
    }

    const content = makeElement("div", "flex flex-1 flex-col p-4");
    const title = makeElement("h3", "font-display text-xl font-bold text-[#FAF7F2]", product.name);
    const description = makeElement("p", "mt-1 flex-1 text-sm leading-6 text-[#A8A29E]", product.description);
    const bottom = makeElement("div", "mt-4 flex items-center justify-between gap-3");
    const price = makeElement("p", "font-display text-xl font-bold text-[#FCA311]", money.format(product.price));
    const addButton = makeElement("button", "min-h-11 rounded-lg border border-[#332E28] bg-[#E63946] px-4 text-sm font-bold text-[#FAF7F2] transition-all hover:bg-[#C92F3B] active:scale-[0.98]");
    addButton.type = "button";
    addButton.textContent = "Personalizar +";
    addButton.setAttribute("aria-label", `Personalizar e adicionar ${product.name}`);
    addButton.addEventListener("click", () => openProductModal(product));
    bottom.append(price, addButton);
    content.append(title, description, bottom);
    card.append(imageContainer, content);
    menuGrid.append(card);
  });
}

function openProductModal(product) {
  selectedProduct = product;
  const modalImage = document.querySelector("#modal-image");
  modalImage.src = product.imagem;
  modalImage.alt = product.name;
  document.querySelector("#modal-category").textContent = product.category;
  document.querySelector("#modal-title").textContent = product.name;
  document.querySelector("#modal-description").textContent = product.description;
  const extrasList = document.querySelector("#extras-list");
  extrasList.replaceChildren();

  EXTRAS.forEach((extra, index) => {
    const label = makeElement("label", "flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-lg border border-[#332E28] bg-[#141210] px-3 py-2 transition-colors hover:border-[#FCA311]");
    const text = makeElement("span", "text-sm font-semibold text-[#FAF7F2]", extra.name);
    const price = makeElement("span", "ml-auto text-sm font-bold text-[#FCA311]", extra.price === 0 ? "Grátis" : `+ ${money.format(extra.price)}`);
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "extra";
    checkbox.value = String(index);
    checkbox.className = "h-5 w-5 accent-[#FCA311]";
    checkbox.addEventListener("change", updateModalTotal);
    label.append(text, price, checkbox);
    extrasList.append(label);
  });

  customizeForm.reset();
  customizeForm.elements.quantity.value = "1";
  updateModalTotal();
  modal.showModal();
  document.querySelector("#close-modal").focus();
}

function getChosenExtras() {
  return Array.from(customizeForm.querySelectorAll('input[name="extra"]:checked'))
    .map((input) => EXTRAS[Number(input.value)]);
}

function updateModalTotal() {
  if (!selectedProduct) return;
  const quantity = Number(customizeForm.elements.quantity.value) || 1;
  const extrasTotal = getChosenExtras().reduce((sum, extra) => sum + extra.price, 0);
  document.querySelector("#modal-total").textContent = money.format((selectedProduct.price + extrasTotal) * quantity);
}

function cartSubtotal() {
  return cart.reduce((sum, item) => sum + (item.product.price + item.extras.reduce((extraSum, extra) => extraSum + extra.price, 0)) * item.quantity, 0);
}

function renderCart() {
  cartItemsElement.replaceChildren();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector("#cart-count").textContent = `(${count} ${count === 1 ? "item" : "itens"})`;
  mobileCartBar.classList.toggle("hidden", count === 0);
  document.body.classList.toggle("has-mobile-cart", count > 0);
  document.querySelector("#mobile-cart-count").textContent = `${count} ${count === 1 ? "item" : "itens"}`;

  if (cart.length === 0) {
    cartItemsElement.append(makeElement("p", "rounded-lg bg-[#141210] px-3 py-4 text-sm text-[#A8A29E]", "Seu carrinho está vazio. Escolha algo gostoso no cardápio!"));
  } else {
    cart.forEach((item, index) => {
      const row = makeElement("div", "flex flex-col gap-3 border-b border-[#332E28] py-4 sm:flex-row sm:items-start sm:justify-between");
      const details = makeElement("div", "min-w-0 flex-1");
      const heading = makeElement("p", "font-display font-bold text-[#FAF7F2]", `${item.quantity}× ${item.product.name}`);
      const extras = item.extras.length
        ? makeElement("p", "mt-1 text-xs text-[#A8A29E]", `Extras: ${item.extras.map((extra) => extra.name).join(", ")}`)
        : null;
      details.append(heading);
      if (extras) details.append(extras);
      if (item.notes) details.append(makeElement("p", "mt-1 text-xs text-[#A8A29E]", `Obs.: ${item.notes}`));

      const unitPrice = item.product.price + item.extras.reduce((sum, extra) => sum + extra.price, 0);
      const controls = makeElement("div", "flex shrink-0 items-center justify-between gap-3 sm:justify-end");
      controls.append(makeElement("span", "text-sm font-bold text-[#FCA311]", money.format(unitPrice * item.quantity)));

      const quantityControls = makeElement("div", "flex items-center overflow-hidden rounded-lg border border-[#332E28] bg-[#141210]");
      const decrease = makeElement("button", "h-10 w-10 text-lg font-bold text-[#FAF7F2] transition-colors hover:bg-[#FCA311] hover:text-[#141210] active:bg-[#FCA311]");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Diminuir quantidade de ${item.product.name}`);
      decrease.addEventListener("click", () => updateCartQuantity(index, -1));
      const quantity = makeElement("span", "min-w-9 text-center text-sm font-bold text-[#FAF7F2]", String(item.quantity));
      const increase = makeElement("button", "h-10 w-10 border-l border-[#332E28] text-lg font-bold text-[#FAF7F2] transition-colors hover:bg-[#FCA311] hover:text-[#141210] active:bg-[#FCA311]");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Aumentar quantidade de ${item.product.name}`);
      increase.addEventListener("click", () => updateCartQuantity(index, 1));
      quantityControls.append(decrease, quantity, increase);
      controls.append(quantityControls);

      const remove = makeElement("button", "min-h-10 rounded-lg border border-[#332E28] bg-[#E63946] px-3 text-sm font-bold text-[#FAF7F2] transition-all hover:bg-[#C92F3B] active:scale-[0.98]");
      remove.type = "button";
      remove.textContent = "Remover";
      remove.setAttribute("aria-label", `Remover ${item.product.name} do carrinho`);
      remove.addEventListener("click", () => removeCartItem(index));
      controls.append(remove);
      row.append(details, controls);
      cartItemsElement.append(row);
    });
  }

  const subtotal = cartSubtotal();
  const isDelivery = document.querySelector('input[name="fulfillment"]:checked').value === "delivery";
  const deliveryCharge = count > 0 && isDelivery ? DELIVERY_FEE : 0;
  document.querySelector("#subtotal").textContent = money.format(subtotal);
  document.querySelector("#delivery-fee-row").classList.toggle("hidden", deliveryCharge === 0);
  document.querySelector("#delivery-fee-row").classList.toggle("flex", deliveryCharge > 0);
  const total = subtotal + deliveryCharge;
  document.querySelector("#total").textContent = money.format(total);
  document.querySelector("#mobile-cart-total").textContent = money.format(total);
}

function updateCartQuantity(index, change) {
  const item = cart[index];
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }
  renderCart();
}

function removeCartItem(index) {
  cart.splice(index, 1);
  renderCart();
}

function updateFulfillmentFields() {
  const isDelivery = document.querySelector('input[name="fulfillment"]:checked').value === "delivery";
  const pickupField = document.querySelector("#pickup-field");
  const addressField = document.querySelector("#address-field");
  pickupField.classList.toggle("hidden", isDelivery);
  addressField.classList.toggle("hidden", !isDelivery);
  document.querySelector('[name="pickupLocation"]').required = !isDelivery;
  document.querySelector('[name="address"]').required = isDelivery;
  renderCart();
}

function updatePaymentFields() {
  const isCash = document.querySelector('input[name="payment"]:checked').value === "Dinheiro";
  const changeField = document.querySelector("#change-field");
  changeField.classList.toggle("hidden", !isCash);
  document.querySelector('[name="changeFor"]').required = false;
}

function buildOrderMessage(form) {
  const values = new FormData(form);
  const isDelivery = values.get("fulfillment") === "delivery";
  const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const orderNumber = `#NZ-${Math.floor(100 + Math.random() * 900)}`;
  const itemLines = cart.flatMap((item) => {
    const itemTotal = (item.product.price + item.extras.reduce((sum, extra) => sum + extra.price, 0)) * item.quantity;
    const lines = [`• *${item.quantity}x ${item.product.name}* — ${money.format(itemTotal)}`];
    if (item.extras.length > 0) {
      const extras = item.extras.map((extra) => {
        const price = extra.price === 0 ? "grátis" : `+${money.format(extra.price)} cada`;
        return `${extra.name} (${price})`;
      });
      lines.push(`  *Adicionais:* ${extras.join(", ")}`);
    }
    if (item.notes) lines.push(`  *Obs:* ${cleanText(item.notes)}`);
    return lines;
  });

  const total = cartSubtotal() + (isDelivery ? DELIVERY_FEE : 0);
  return [
    `*${BUSINESS_NAME} | Pedido ${orderNumber}*`,
    "",
    "*Itens*",
    ...itemLines,
    "",
    `*Local: ${isDelivery ? "Endereço" : "Praça"}*`,
    `*Cliente:* ${cleanText(values.get("customerName"))}`,
    isDelivery
      ? `*Endereço:* ${cleanText(values.get("address"))}`
      : `*Ponto:* ${cleanText(values.get("pickupLocation"))}`,
    "",
    `*Pagamento:* ${values.get("payment")}`,
    ...(values.get("payment") === "Dinheiro" && values.get("changeFor")
      ? [`*Troco para:* ${cleanText(values.get("changeFor"))}`]
      : []),
    "",
    `*Subtotal:* ${money.format(cartSubtotal())}`,
    ...(isDelivery ? [`*Taxa de entrega:* ${money.format(DELIVERY_FEE)}`] : []),
    `*Total:* ${money.format(total)}`
  ].join("\n");
}

customizeForm.addEventListener("input", (event) => {
  if (event.target.name === "quantity") updateModalTotal();
});
customizeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!selectedProduct || !customizeForm.reportValidity()) return;
  const quantity = Number(customizeForm.elements.quantity.value);
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    customizeForm.elements.quantity.setCustomValidity("Escolha uma quantidade entre 1 e 20.");
    customizeForm.elements.quantity.reportValidity();
    customizeForm.elements.quantity.setCustomValidity("");
    return;
  }
  cart.push({
    product: selectedProduct,
    extras: getChosenExtras(),
    notes: customizeForm.elements.notes.value.trim(),
    quantity
  });
  modal.close();
  renderCart();
  document.querySelector("#order-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#close-modal").addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});
menuSearch.addEventListener("input", renderProducts);
document.querySelectorAll('input[name="fulfillment"]').forEach((input) => input.addEventListener("change", updateFulfillmentFields));
document.querySelectorAll('input[name="payment"]').forEach((input) => input.addEventListener("change", updatePaymentFields));
document.querySelector("#order-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (cart.length === 0) {
    document.querySelector("#menu-title").scrollIntoView({ behavior: "smooth", block: "start" });
    window.alert("Seu carrinho está vazio. Adicione pelo menos um item antes de enviar o pedido.");
    return;
  }
  if (!form.reportValidity()) return;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderMessage(form))}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

renderFilters();
renderProducts();
renderCart();
updateFulfillmentFields();
updatePaymentFields();
updateBusinessStatus();
window.setInterval(updateBusinessStatus, 60_000);
