---
title: "Getting Started with Next.js and TypeScript"
date: "2025-03-20"
excerpt: "A beginner's guide to setting up a Next.js project with TypeScript and building your first components."
coverImage: "/images/nextjs-typescript.jpg"
---

# Getting Started with Next.js and TypeScript

Next.js has become one of the most popular React frameworks for building modern web applications. When combined with TypeScript, it provides a powerful and type-safe development experience. In this article, I'll walk you through setting up a Next.js project with TypeScript and creating your first components.

## Why Next.js?

Next.js offers several advantages over a standard React application:

- **Server-side rendering** and static site generation
- **Automatic code splitting** for faster page loads
- **Simple client-side routing**
- **API routes** for backend functionality
- **Built-in image optimization**

When combined with TypeScript, you get the additional benefits of static type-checking, better IDE support, and improved code quality.

## Setting Up Your Project

Let's start by creating a new Next.js project with TypeScript. Open your terminal and run:

```bash
npx create-next-app@latest my-project --typescript
```

This command creates a new Next.js project with TypeScript configuration already set up. Navigate to your project directory:

```bash
cd my-project
```

And start the development server:

```bash
npm run dev
```

Your new Next.js application should now be running at `http://localhost:3000`.

## Creating Your First Component

Let's create a simple component in TypeScript. Create a new file in the `components` directory called `Button.tsx`:

```tsx
import React from 'react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  variant = 'primary' 
}) => {
  const baseStyles = "px-4 py-2 rounded font-medium";
  const variantStyles = variant === 'primary' 
    ? "bg-blue-500 text-white hover:bg-blue-600" 
    : "bg-gray-200 text-gray-800 hover:bg-gray-300";
  
  return (
    <button 
      className={`${baseStyles} ${variantStyles}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;
```

This component uses TypeScript interfaces to define the props that can be passed to the component, making your code more maintainable and easier to understand.

## Conclusion

You've now created a Next.js project with TypeScript and built your first component. From here, you can continue to build out your application by creating more components, pages, and adding styling.

Next.js and TypeScript together provide a powerful foundation for building modern web applications with type safety and excellent developer experience.

Stay tuned for more articles in this series where we'll explore more advanced features of Next.js and TypeScript.