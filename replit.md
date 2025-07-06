# Unit Converter & Calculator Application

## Overview

This is a full-stack web application that provides multiple conversion tools and a calculator. The application features currency conversion, length/weight conversion, clothing size conversion, and a calculator, all wrapped in a modern React-based user interface with Firebase authentication and Firebase Realtime Database for storing user conversion history.

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
- **Database**: In-memory storage for development/testing (PostgreSQL schemas available)
- **External APIs**: Exchange rate API for currency conversion
- **API Design**: RESTful endpoints with proper error handling

### Data Storage Solutions
- **User Conversion History**: Firebase Realtime Database for real-time storage and sync
- **User Authentication**: Firebase Authentication with Google OAuth
- **Development Storage**: In-memory storage for non-user data
- **Real-time Updates**: Firebase Realtime Database provides live updates to conversion history

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
- **User Profiles**: Firebase Authentication manages user information
- **Conversion History**: Firebase Realtime Database stores and syncs user conversion history in real-time
- **Favorites**: Save frequently used conversion pairs (backend API)
- **Real-time Updates**: Live exchange rate updates for currency conversions and real-time conversion history sync

### UI/UX Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Theme**: User-switchable theme with system preference detection
- **Component Library**: Comprehensive shadcn/ui component system
- **Toast Notifications**: User feedback for actions and errors
- **Loading States**: Proper loading indicators for async operations

## Data Flow

1. **User Authentication**: Firebase handles authentication with Google OAuth
2. **Conversion Requests**: Frontend performs conversions locally and saves to Firebase Realtime Database
3. **Real-time Data**: Exchange rates fetched from external APIs and cached; conversion history synced in real-time via Firebase
4. **Persistence**: User conversion history stored in Firebase Realtime Database; favorites stored via backend API
5. **State Management**: React Query manages server state; custom Firebase hooks manage real-time conversion history

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
- July 06, 2025: Initial setup
- July 06, 2025: Integrated Firebase Realtime Database for storing user conversion history
- July 06, 2025: Updated all converter components to save conversion data to Firebase instead of backend API
- July 06, 2025: Created useFirebaseConversions hook for real-time conversion history management

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes
✓ Firebase Realtime Database integration completed
✓ All converter components now save to Firebase 
✓ Real-time conversion history sync implemented
✓ Custom Firebase hooks created for data management
→ Firebase domain authorization pending (requires user to add domain to Firebase console)