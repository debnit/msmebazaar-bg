# MSMEBazaar Mobile App

A production-grade React Native mobile application for the MSMEBazaar platform.

## Features

- 🔐 Authentication with JWT tokens
- 👥 Role-based access control
- 📱 Native iOS and Android support
- 🔄 Real-time data synchronization
- 💳 Integrated payment system
- 📊 Business analytics and dashboards
- 🚀 Optimized for performance

## Tech Stack

- React Native (Expo)
- TypeScript
- React Navigation
- Zustand (State Management)
- React Query (Data Fetching)
- AsyncStorage

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
src/
├── api/              # API client and services
├── components/       # Reusable UI components
├── navigation/       # Navigation configuration
├── screens/          # Screen components
├── store/            # State management
├── modules/          # Business logic modules
└── utils/            # Utility functions
```

## Shared Code

This mobile app leverages shared types, schemas, and utilities from the monorepo's `shared/` folder, ensuring consistency across web and mobile platforms.
