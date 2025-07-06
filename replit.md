# Unit Converter & Calculator Application

## Overview

This is a full-stack web application that provides multiple conversion tools and a calculator. The application features currency conversion, length/weight conversion, clothing size conversion, and a calculator, all wrapped in a modern React-based user interface with authentication and data persistence.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with dark/light theme support
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Firebase Authentication with Google sign-in

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: In-memory storage with fallback to PostgreSQL for production
- **API Design**: RESTful endpoints with proper error handling

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM with type-safe queries and migrations
- **Development Storage**: In-memory storage for development/testing
- **Session Storage**: PostgreSQL-based session storage for user authentication

## Key Components

### Authentication and Authorization
- Firebase Authentication integration for user management
- Google OAuth sign-in flow with redirect handling
- Backend user synchronization with Firebase UID mapping
- Session-based authentication for API endpoints

### Conversion Tools
1. **Currency Converter**: Real-time exchange rates via external API
2. **Length Converter**: Metric and imperial unit conversions
3. **Weight Converter**: Mass/weight unit conversions
4. **Clothing Size Converter**: International clothing and shoe size charts
5. **Calculator**: Basic arithmetic calculator with memory functions

### Data Management
- **User Profiles**: Store user information and preferences
- **Conversion History**: Track and display user's conversion history
- **Favorites**: Save frequently used conversion pairs
- **Real-time Updates**: Live exchange rate updates for currency conversions

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: User-switchable theme with system preference detection
- **Component Library**: Comprehensive shadcn/ui component system
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Proper loading indicators for async operations

## Data Flow

1. **User Authentication**: Firebase handles authentication, backend syncs user data
2. **Conversion Requests**: Frontend makes API calls, backend processes and stores results
3. **Real-time Data**: Exchange rates fetched from external APIs and cached
4. **Persistence**: All user data, history, and favorites stored in PostgreSQL
5. **State Management**: React Query manages server state with optimistic updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database client for PostgreSQL
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **firebase**: Authentication and user management
- **express**: Backend web framework

### UI Dependencies
- **@radix-ui/***: Headless UI components for accessibility
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe variant handling

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and development experience
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Node.js server to `dist/index.js`
- **Database**: Drizzle generates and runs migrations

### Environment Configuration
- **Development**: Local development with Vite dev server and Express
- **Production**: Static frontend serving with Express backend
- **Database**: Neon Database for both development and production

### Scaling Considerations
- **Database**: Serverless PostgreSQL scales automatically
- **Authentication**: Firebase handles user scaling
- **API**: Stateless design allows for horizontal scaling
- **CDN**: Static assets can be served via CDN

## Changelog
- July 06, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.