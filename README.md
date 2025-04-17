# ADT Vue Gallery Project

A Vue.js-based art gallery application built with Vue 3 and Vite, featuring a responsive grid layout, search functionality, and category filtering.

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm (Latest version recommended)

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ADT-VUE.git
   cd ADT-VUE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` and will be accessible on your local network.

## Available Scripts

- `npm run dev` - Start development server with host networking enabled
- `npm run build` - Build for production using Vite
- `npm run preview` - Preview production build locally

## Project Dependencies

Main dependencies:
- Vue.js (^3.5.13)
- Vue Router (4)

Development dependencies:
- Vite (^6.0.2)
- @vitejs/plugin-vue (^5.2.1)

## Project Structure

```
ADT-VUE/
├── src/
│   ├── components/     # Vue components
│   ├── assets/        # Static assets (images, styles)
│   ├── types/         # TypeScript type definitions
│   └── helpers/       # Utility functions
├── public/           # Public static files
└── index.html        # Entry HTML file
```

## Features

- Responsive grid gallery layout
- Image search functionality
- Category filtering
- Hover effects for gallery items
- Mobile-first design approach
- Consistent page transitions across the application

## Technology Stack

- Vue 3 with Options API
- Vue Router for navigation
- Vite for build tooling
- CSS (with Flexbox for layout)

## Navigation System

The application uses a centralized navigation system via the `NavigationManager` class to ensure consistent transition behaviors across all pages:

- All internal navigation is handled through the `navigationManager.navigateTo()` method
- Page transitions use a consistent fade effect with configurable timing
- The system prevents multiple navigation attempts during transitions
- Transitions are applied uniformly across menu navigation, button clicks, and component interactions
- Smooth scroll-to-top is synchronized with fade-out transitions, ensuring the menu stays aligned during navigation

### Navigation Features

- **Synchronized Transitions**: Content fades out while simultaneously scrolling to the top
- **Fixed Menu**: The menu stays in place during transitions for a seamless user experience
- **GPU Acceleration**: All transitions use hardware acceleration for smooth performance
- **Subtle Animation**: Content has a subtle lift effect during transitions

### Navigation Usage

To navigate within the application, use:

```js
import navigationManager from '../utils/navigationManager';

// Inside component methods
navigationManager.navigateTo(router, '/target-path');
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
