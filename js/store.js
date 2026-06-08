(function () {
  const products = window.KZN_PRODUCTS || [];

  function money(value) {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(Number(value));
  }

  function productCard(product) {
    return `
      <article class="card product-card" data-category="${product.category}" data-model="${product.model}">
        <a class="card-media" href="./product.html?sku=${product.sku}" aria-label="View ${product.title}">
          <img src="${product.image}" alt="${product.title}" />
        </a>
        <div class="card-body">
          <span class="badge">${product.badge}</span>
          <h3>${product.title}</h3>
          <p>${product.fitment}</p>
          <div class="product-meta">
            <span class="badge">${product.model} ${product.years}</span>
            <span class="badge">${product.difficulty}</span>
          </div>
          <div class="rating">***** <span>${product.rating || "(12)"}</span></div>
          <div class="price-row">
            <span class="price">${money(product.price)}</span>
            <a class="mini-button" href="./product.html?sku=${product.sku}">Add</a>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts(container, list) {
    container.innerHTML = list.map(productCard).join("");
  }

  function initProductGrids() {
    document.querySelectorAll("[data-products]").forEach((container) => {
      const limit = Number(container.dataset.limit || products.length);
      const category = container.dataset.category;
      const list = category
        ? products.filter((product) => product.category === category)
        : products;
      renderProducts(container, list.slice(0, limit));
    });
  }

  function initShopFilters() {
    const grid = document.querySelector("[data-shop-grid]");
    if (!grid) return;

    const controls = document.querySelectorAll("[data-filter]");

    function selected(name) {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : "all";
    }

    function applyFilters() {
      const model = selected("model");
      const category = selected("category");
      const filtered = products.filter((product) => {
        const modelOk = model === "all" || product.model === model;
        const categoryOk = category === "all" || product.category === category;
        return modelOk && categoryOk;
      });
      renderProducts(grid, filtered);
      const count = document.querySelector("[data-result-count]");
      if (count) count.textContent = `${filtered.length} products`;
    }

    controls.forEach((control) => control.addEventListener("change", applyFilters));
    applyFilters();
  }

  function initProductPage() {
    const page = document.querySelector("[data-product-page]");
    if (!page) return;

    const params = new URLSearchParams(window.location.search);
    const sku = params.get("sku") || products[0]?.sku;
    const product = products.find((item) => item.sku === sku) || products[0];
    if (!product) return;

    document.title = `${product.title} | KZN Collective`;
    const setText = (selector, value) => {
      const node = document.querySelector(selector);
      if (node) node.textContent = value;
    };

    setText("[data-product-title]", product.title);
    setText("[data-product-price]", money(product.price));
    setText("[data-product-description]", product.description);
    setText("[data-product-fitment]", product.fitment);
    setText("[data-product-included]", product.included);
    setText("[data-product-difficulty]", product.difficulty);
    setText("[data-product-tools]", product.tools);
    setText("[data-product-time]", product.time);
    setText("[data-product-qc]", product.qc);
    setText("[data-product-model]", `${product.model} ${product.years}`);

    document.querySelectorAll("[data-product-image]").forEach((image) => {
      image.src = product.image;
      image.alt = product.title;
    });
  }

  function initNewsletter() {
    document.querySelectorAll("[data-newsletter]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const message = form.querySelector("[data-newsletter-message]");
        if (message) {
          message.textContent = "Thanks. Launch updates will go here once email is wired in.";
        }
      });
    });
  }

  function initFloatingHeader() {
    if (!document.body.classList.contains("home-page")) return;

    function updateHeader() {
      document.body.classList.toggle("header-scrolled", window.scrollY > 72);
    }

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  initProductGrids();
  initShopFilters();
  initProductPage();
  initNewsletter();
  initFloatingHeader();
})();
