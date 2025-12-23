# 💧 LiquidShop

LiquidShop is a modern, high-performance e-commerce platform built with **React 18**, **TypeScript**, and **Vite**. It features a stunning glassmorphism-inspired UI and follows the **Feature-Sliced Design (FSD)** architecture for maximum scalability and maintainability.

---

## ✨ Features

- 🛍️ **Premium Product Catalog**: Browse a curated collection of products with an elegant interface.
- 🛒 **Shopping Experience**: Seamlessly add products to your cart and manage your selections.
- 📦 **Order Management**: Track and view your order history with detailed information.
- ➕ **Product Creation**: Easily add new items to the inventory via a dedicated interface.
- 📱 **Fully Responsive**: Optimized for all devices, from desktop to mobile.
- 🎨 **Glassmorphism UI**: A modern design language utilizing backdrop blurs and vibrant gradients.
- 📖 **Built-in Documentation**: Integrated user guide to help customers navigate the shop.

---

## 🚀 Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) Primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 6](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Linting**: [ESLint](https://eslint.org/)

---

## 🏗️ Architecture

LiquidShop follows the **Feature-Sliced Design (FSD)** architectural pattern. This methodology organizes the codebase based on business logic and scope:

- **`app/`**: Application-wide setup, providers, and global styles.
- **`pages/`**: Full pages composed of features and entities.
- **`entities/`**: Business entities (e.g., Product, Order) containing their specific logic and components.
- **`shared/`**: Reusable components, utilities, and configurations (API clients, hooks, etc.).

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/webshop-react.git
   cd webshop-react
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the root directory and configure your API endpoints:

```env
VITE_API_URL_INVENTORY=your_inventory_api_url
VITE_API_URL_ORDER=your_order_api_url
```

*Note: The application defaults to `localhost` endpoints if these are not provided.*

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 🧪 Available Scripts

- `npm run dev`: Runs the app in development mode.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to find and fix code style issues.
- `npm run test`: Executes unit and integration tests using Vitest.

---

## 📸 Screenshots

*(Add screenshots of your application here)*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE.md).
