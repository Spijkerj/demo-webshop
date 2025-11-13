const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

// --- Basket Helpers ---
function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function saveBasket(basket) {
  localStorage.setItem("basket", JSON.stringify(basket));
}

// --- Basket Logic ---
function addToBasket(productKey) {
  const basket = getBasket();
  const existingItem = basket.find((item) => item.name === productKey);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    basket.push({ name: productKey, quantity: 1 });
  }

  saveBasket(basket);
  renderBasketIndicator();
  renderBasket();
}

function clearBasket() {
  localStorage.removeItem("basket");
  renderBasketIndicator();
  renderBasket();
}

// --- UI Rendering ---
function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;

  basketList.innerHTML = "";

  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }

  basket.forEach((product) => {
    const info = PRODUCTS[product.name];
    if (info) {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class='basket-emoji'>${info.emoji}</span>
        <span>${product.quantity}x ${info.name}</span>
      `;
      basketList.appendChild(li);
    }
  });

  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");

  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }

  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0);

  if (totalItems > 0) {
    indicator.textContent = totalItems;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// --- Init ---
document.addEventListener("DOMContentLoaded", () => {
  renderBasketIndicator();
  renderBasket();
});

// Make functions globally available for HTML buttons
window.addToBasket = addToBasket;
window.clearBasket = clearBasket;
