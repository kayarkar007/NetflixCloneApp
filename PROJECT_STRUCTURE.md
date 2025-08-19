# Netflix Clone - Project Structure

## 📁 Root Directory
```
Netflix Clone/
├── backend/           # Backend server (Node.js + Express + MongoDB)
├── frontend/          # Frontend app (React + Tailwind CSS)
├── .gitignore         # Git ignore rules
├── package.json       # Root package.json for running both servers
└── README.md          # Project documentation
```

## 🚀 Backend (`/backend`)
```
backend/
├── models/            # MongoDB schemas (User, Movie)
├── routes/            # API endpoints (auth, movies, users)
├── middleware/        # Authentication middleware
├── services/          # OMDB API service
├── scripts/           # Database population scripts
├── index.js           # Main server file
├── package.json       # Backend dependencies
└── .env               # Environment variables
```

## 🎨 Frontend (`/frontend`)
```
frontend/
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── store/         # State management (Zustand)
│   ├── services/      # API service layer
│   ├── App.js         # Main app component
│   └── index.js       # App entry point
├── public/
│   ├── index.html     # HTML template
│   └── manifest.json  # PWA manifest
├── package.json       # Frontend dependencies
├── tailwind.config.js # Tailwind CSS configuration
└── postcss.config.js  # PostCSS configuration
```

## 🗑️ Removed Files
- ❌ `server/` - Old server directory (moved to `backend/`)
- ❌ `node_modules/` - Root node_modules (separate ones in backend/frontend)
- ❌ `package-lock.json` - Root lock file (separate ones in backend/frontend)
- ❌ `setup.js` - One-time setup script
- ❌ `logo192.png` - Placeholder logo file
- ❌ `logo512.png` - Placeholder logo file

## 🚀 Available Scripts
```bash
# Root directory
npm run dev          # Start both backend and frontend
npm run server       # Start only backend
npm run client       # Start only frontend
npm run install-all  # Install all dependencies

# Backend directory
cd backend
npm start           # Start production server
npm run dev         # Start development server
npm run populate-movies  # Populate database with OMDB data

# Frontend directory
cd frontend
npm start           # Start React development server
npm run build       # Build for production
```

## ✨ Clean Project Benefits
- **Organized Structure**: Clear separation between backend and frontend
- **No Duplicates**: Single source of truth for each component
- **Easy Maintenance**: Clear file organization
- **Proper Dependencies**: Separate package.json files for each part
- **No Unused Files**: Removed all unnecessary placeholder files
