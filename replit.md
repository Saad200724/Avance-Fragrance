# Avancé Apparel - Premium Fragrance E-commerce Platform

## Overview

Avancé Apparel is a luxury fragrance e-commerce platform built with modern web technologies. The application features a sleek, dark luxury theme with a focus on premium user experience. It provides a complete e-commerce solution with product browsing, shopping cart functionality, checkout process, and admin management capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks and Context API for cart state
- **UI Components**: Radix UI components with custom Tailwind CSS styling
- **Styling**: Tailwind CSS with dark luxury theme (neutral base colors with gold accents)
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Database Connection**: Neon serverless PostgreSQL
- **API**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL store

### Design System
- **Theme**: Dark luxury aesthetic with gold accents
- **Typography**: Inter for body text, Playfair Display for headings
- **Color Scheme**: Dark backgrounds with gold highlights (HSL-based color system)
- **Component Library**: Shadcn/ui components with custom luxury styling

## Key Components

### Database Schema
- **Products**: Core product information with category, pricing, and inventory
- **Customers**: User registration and profile management
- **Orders**: Order processing with customer and shipping details
- **Order Items**: Individual line items for each order
- **Contact Messages**: Customer inquiry handling

### Core Features
- **Product Catalog**: Category-based product browsing with search and filtering
- **Shopping Cart**: Persistent cart with quantity management
- **Checkout Process**: Multi-step checkout with shipping and payment options
- **Admin Panel**: Product, order, and customer management
- **Responsive Design**: Mobile-first approach with desktop optimization

### UI Components
- **Product Display**: Grid and list view modes with detailed product cards
- **Cart Overlay**: Slide-out cart with real-time updates
- **Navigation**: Fixed header with search and cart access
- **Forms**: Comprehensive form handling with validation

## Data Flow

### Frontend to Backend
1. React components make API calls using TanStack Query
2. API requests are handled through a centralized query client
3. Data is cached and synchronized across components
4. Cart state is managed through React Context

### Database Operations
1. Drizzle ORM provides type-safe database operations
2. Connection pooling through Neon serverless
3. Migrations handled through Drizzle Kit
4. Schema definitions shared between frontend and backend

### Order Processing
1. Cart items are validated against inventory
2. Customer information is captured during checkout
3. Orders are created with associated line items
4. Inventory levels are updated post-purchase

## External Dependencies

### Core Technologies
- **Database**: Neon PostgreSQL (serverless)
- **UI Library**: Radix UI primitives
- **Styling**: Tailwind CSS with PostCSS
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for date formatting
- **Icons**: Lucide React icons

### Development Tools
- **Build**: Vite with TypeScript support
- **Database**: Drizzle Kit for migrations
- **Development**: tsx for TypeScript execution
- **Replit Integration**: Cartographer and runtime error overlay

## Deployment Strategy

### Build Process
1. Frontend assets are built using Vite
2. Backend is bundled using esbuild
3. Static files are served from dist/public
4. Environment variables handle database connection

### Production Configuration
- Database URL configured for Neon PostgreSQL
- Session storage uses PostgreSQL
- Static file serving for production builds
- Environment-specific configuration handling

### Development Environment
- Hot module replacement through Vite
- TypeScript checking and compilation
- Database migrations through Drizzle Kit
- Replit-specific development features

## Changelog

- July 04, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.