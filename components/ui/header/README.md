# Header Component Architecture

This document describes the architecture of the Header component used in the Hurass Al-Thughur project.

## Overview

The Header component has been modularized into several smaller components to improve maintainability and reusability. The architecture follows a component-based approach with clear separation of concerns.

## Component Structure

```
components/ui/
├── Header.tsx               # Main Header container component
├── Header.module.css        # CSS modules for styling
├── hooks/
│   └── useScrollHeader.ts   # Custom hook for scroll behavior
└── header/
    ├── Icons.tsx            # Reusable icon components
    ├── Logo.tsx             # Logo component
    ├── DesktopNavigation.tsx # Desktop navigation menu
    ├── MobileMenu.tsx       # Mobile navigation menu and overlay
    └── navUtils.ts          # Helper functions for navigation
```

## Component Responsibilities

- **Header.tsx**: Main container component that orchestrates the header functionality
- **useScrollHeader.ts**: Manages scroll state and header height changes
- **Logo.tsx**: Handles the logo display and hover effects
- **DesktopNavigation.tsx**: Renders the navigation menu for desktop views
- **MobileMenu.tsx**: Manages the mobile menu, toggle button, and overlay
- **Icons.tsx**: Contains reusable icon components
- **navUtils.ts**: Provides utility functions for building navigation links

## Features

- **Responsive Design**: Adapts to both desktop and mobile screens
- **Scroll Effects**: Header adjusts size and appearance on scroll
- **RTL Support**: Full support for Arabic (right-to-left) language
- **Active State**: Visual indicators for the current page
- **Language Switching**: Easy toggling between languages
- **Animations**: Smooth transitions and hover effects

## Usage

The Header component is used in the main layout and requires locale and translation messages props:

```tsx
<Header locale={locale} messages={messages} />
```

## Future Improvements

- Add more customization options through props
- Implement theme switching functionality
- Add performance optimizations for animations
