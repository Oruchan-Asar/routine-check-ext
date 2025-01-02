# Todo Check Extension 📝

A Chrome extension built with Next.js that helps you manage your daily tasks and syncs them with your calendar. Keep track of your todos and never miss important tasks again!

## Features ✨

- Create and manage daily todo lists
- Mark todos as complete/incomplete
- Calendar integration to track missed todos
- Clean and intuitive user interface
- Chrome extension popup for quick access
- Persistent storage for your todos

## Tech Stack 🛠️

- Next.js - React framework for the frontend
- Chrome Extension Manifest V3
- Chrome Storage API for data persistence
- TypeScript for type safety
- Tailwind CSS for styling
- React Icons for UI elements

## Prerequisites 📋

- Node.js (v16 or higher)
- npm or yarn
- Google Chrome browser

## Installation 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/todo-check-ext.git
cd todo-check-ext
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Build the extension:

```bash
npm run build
# or
yarn build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory from your project

## Development 💻

1. Start the development server:

```bash
npm run dev
# or
yarn dev
```

2. Make your changes and the extension will automatically rebuild

## Project Structure 📁

```
todo-check-ext/
├── app/                     # App Router directory
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   ├── todos/            # Todos feature
│   │   ├── page.tsx     # Todos page
│   │   └── layout.tsx   # Todos layout
│   └── calendar/        # Calendar feature
│       ├── page.tsx     # Calendar page
│       └── layout.tsx   # Calendar layout
├── components/           # Shared React components
│   ├── ui/              # UI components
│   └── features/        # Feature-specific components
├── lib/                 # Utility functions and shared logic
│   ├── types/          # TypeScript types/interfaces
│   └── utils/          # Helper functions
├── styles/              # Global styles
├── public/              # Static assets
├── extension/          # Chrome extension specific files
│   ├── manifest.json   # Extension manifest
│   ├── background.ts   # Service worker
│   └── popup/         # Extension popup
├── tailwind.config.js  # Tailwind configuration
└── package.json       # Project dependencies
```

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Next.js team for the amazing framework
- Chrome Extensions documentation
- Calendar API integration
