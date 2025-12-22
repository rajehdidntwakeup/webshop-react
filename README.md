# Webshop React 🛍️

A modern, high-performance e-commerce frontend built with **React 18**, **TypeScript**, and **Vite**. This project follows the **Feature-Sliced Design (FSD)** architectural pattern to ensure scalability, maintainability, and clear separation of concerns.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)
![FSD](https://img.shields.io/badge/Architecture-FSD-orange)

## ✨ Features

- 🚀 **Modern UI/UX**: Clean, responsive design with glassmorphism effects and smooth animations using Tailwind CSS and Lucide icons.
- 📦 **Product Management**: Browse through a curated collection of products with real-time inventory updates.
- ➕ **Item Creation**: Seamlessly add new products to the catalog via a dedicated creation flow.
- 📜 **Order Tracking**: View and manage customer orders with different states (loading, error, empty).
- 🧩 **Component-Driven**: Built using Radix UI primitives for high accessibility and reliability.
- 🛠️ **FSD Architecture**: Organized by business logic layers (App, Pages, Entities, Shared) for better developer experience.
- 🧪 **Testing**: Comprehensive unit and integration tests using Vitest and React Testing Library.

## 🛠️ Tech Stack

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Routing**: [React Router 6](https://reactrouter.com/)
- **Forms**: [React Hook Form](https://react-hook-form.com/)
- **State Management**: React Context API
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🏗️ Project Structure

This project follows the **Feature-Sliced Design (FSD)** methodology:

```text
src/
  ├── app/          # App-wide providers, global styles, and layout wrappers
  ├── pages/        # Composition of pages (Home, Products, Orders, Create)
  ├── entities/     # Domain-specific logic (Product, Order)
  ├── shared/       # Reusable UI components, utilities, and configuration
  ├── main.tsx      # Entry point
  └── index.css     # Global styles (Tailwind)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

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

3. Configure environment variables (optional):
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL_INVENTORY=http://localhost:8080/api/inventory
   VITE_API_URL_ORDER=http://localhost:8081/api/order
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

- `npm run dev`: Start development server.
- `npm run build`: Build the production-ready bundle.
- `npm run lint`: Run ESLint to check for code quality.
- `npm run test`: Run unit and integration tests using Vitest.

## 🧪 Testing

We use **Vitest** for unit and integration testing. To run the tests:

```bash
npm run test
```

For watch mode during development:
```bash
npx vitest
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git checkout -b feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
  