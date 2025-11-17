# Illini Lost & Found

A web application for the University of Illinois community to report and find lost items.

## Team: Vibe Coders (CS409 Project)
- **Database Lead**: Sushanth
- **Project Manager**: [Name]
- **Backend Lead**: [Name]
- **Frontend Lead**: [Name]
- **UX/UI Designer**: [Name]

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: JWT

---

## 🚀 Quick Start for Team Members

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Clone Repository
```bash
git clone <repo-url>
cd illini-lost-found
```

### 2. Setup Backend
```bash
cd backend
npm install
npm run dev
```
Backend runs on: **http://localhost:5000**

### 3. Setup Frontend (Open new terminal)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: **http://localhost:3000**

### 4. Access Application
Open browser: **http://localhost:3000**

---

## 📁 Project Structure
```
illini-lost-found/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, error handling
│   │   └── server.ts     # Entry point
│   ├── .env              # MongoDB connection (shared)
│   └── package.json
│
├── frontend/             # React + TypeScript
│   ├── src/
│   │   ├── api/          # API clients
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Route pages
│   │   ├── store/        # Zustand state management
│   │   └── App.tsx       # Main app with routing
│   ├── .env              # API URL
│   └── package.json
│
└── README.md
```

---

## ✨ Features
- ✅ User Authentication (Register/Login)
- ✅ Report Lost Items
- ✅ Report Found Items
- ✅ Browse & Search Items
- ✅ Filter by Type, Category, Location
- ✅ Claim Items with Verification
- ✅ Admin Dashboard
- ✅ Marketplace for Unclaimed Items
- ✅ Responsive Design (UIUC Branding)

---

## 🎯 Development Workflow

### Backend Development
```bash
cd backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm start            # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🧪 Testing the App

1. **Register**: Create account at `/register`
2. **Report Lost Item**: Click "Report Lost" in navbar
3. **Browse Items**: View all items at `/browse`
4. **Search**: Use search bar to find items
5. **Claim Item**: Click item → "Claim This Item"

---

## 🔑 Admin Access
To test admin features:
1. Go to MongoDB Atlas
2. Find user in `users` collection
3. Change `role: "user"` to `role: "admin"`
4. Access admin dashboard at `/admin`

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Items
- `GET /api/items` - Get all items
- `GET /api/items/:id` - Get single item
- `POST /api/items` - Create item
- `GET /api/items/search?q=query` - Search items
- `GET /api/items/my-items` - Get user's items

### Claims
- `POST /api/claims` - Create claim
- `GET /api/claims/my-claims` - Get user's claims

### Admin
- `GET /api/admin/items` - Get all items (admin)
- `GET /api/admin/claims` - Get all claims (admin)
- `PATCH /api/admin/claims/:id` - Approve/reject claim
- `GET /api/admin/stats` - Get statistics

### Marketplace
- `GET /api/marketplace` - Get marketplace items
- `POST /api/marketplace` - List item on marketplace

---

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB Atlas connection is working
- Make sure `.env` file exists in backend folder

### Frontend won't start
- Run `npm install` in frontend folder
- Check if backend is running on port 5000

### Can't login/register
- Check browser console for errors
- Verify backend is connected to MongoDB

### Port already in use
- Backend: Change port in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

---

## 📚 Tech Documentation
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📞 Contact
For questions, contact the Vibe Coders team on Discord/Slack.

---

## 📄 License
University of Illinois CS409 Project - Fall 2024
