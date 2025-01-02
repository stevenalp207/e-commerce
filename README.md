<h1 align=center>StyleUP | AstroJs + Shopify + Tailwind CSS + TypeScript Starter and Boilerplate</h1>



## 📌 Key Features

- 🌐 Dynamic Products from Shopify Storefront API
- 💸 Checkout and Payments with Shopify
- 🌞 Automatic Light/Dark Mode
- 🚀 Fetching and Caching Paradigms
- 🔗 Server Actions for Mutations
- 🔐 User Authentication
- 🧩 Similar Products Suggestions
- 🔍 Search, Sort, Different Views Functionality
- 🏷️ Tags & Categories & Vendors & Price Range & Product Variants Functionality
- 🖼️ Single Product Image Zoom, Hover Effect, Slider
- 🛒 Cart & Easy editing options for cart items
- 📝 Product Description on Multiple Tabs
- 🔗 Netlify Setting Pre-configured
- 📞 Support Contact Form
- 📱 Fully Responsive
- 🔄 Dynamic Home Banner Slider
- 📝 Write and Update Content in Markdown / MDX
- ⌛ Infinite Product Load on Scrolling

### 📄 10+ Pre-designed Pages

- 🏠 Homepage
- 👤 About
- 📞 Contact
- 🛍️ Products
- 📦 Product Single
- 💡 Terms of services
- 📄 Privacy Policy
- 🔐 Login
- 🔑 Register
- 🚫 Custom 404

## 🚀 Getting Started

### 📦 Dependencies

- shopify
- astro 4.16.9+
- node v20.10+
- npm v10.2+
- tailwind v3.4+


## 🛒 To Add Featured or Home Products

To place products on the homepage or mark them as featured, you should include the following information in the product's details:

```json
"collections": {
  "hero_slider": "productos-inicio",
  "featured_products": "productos-destacadas"
}
```

---

## 📝 Additional Information

If you need to add extra information to the product details, you can include it by using the following content structure:

```json
--- split content ---
```

### 👉 Install Dependencies

```bash
npm install
```

### 👉 Development Command

```bash
npm run dev
```

### 👉 Build Command

```bash
npm run build
```
