export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://your-frontend-name.onrender.com',  // Will update later
        'https://illini-lost-found.onrender.com',   // Example
      ]
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
};