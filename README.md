# San Francisco Business Dashboard

A modern, data-driven dashboard application showcasing business analytics for San Francisco.

The data can be filtered and viewed in a variety of ways, most notably by individual district. 

The data source is updated daily by the City of San Francisco. See https://data.sfgov.org/ for more info. 

## Features

- Data caching for expensive API calls using TanStack Query
- Interactive business analytics dashboard
- Modern TypeScript/React architecture
- Responsive design

## Tech Stack

- React with TypeScript
- Vite for build tooling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Build for production:
   ```bash
   pnpm build
   ```

## Project Structure

```
src/
├── lib/           # Core application logic
├── pages/         # Page components
├── components/    # Reusable UI components
└── public/        # Static assets
```

## License

MIT License - feel free to use this code as a reference or starting point for your own projects.
