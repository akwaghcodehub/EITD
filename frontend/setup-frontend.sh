#!/bin/bash

echo "🚀 Setting up Illini Lost & Found Frontend..."

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/{api,components,pages,store,styles,types,utils}

# Create configuration files
echo "⚙️ Creating configuration files..."

# package.json
cat > package.json << 'EOF'
{
  "name": "illini-lost-found-frontend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "zustand": "^4.4.7",
    "react-icons": "^4.12.0",
    "date-fns": "^3.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/node": "^20.10.4",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.8",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
EOF

# vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
EOF

# tailwind.config.js
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'illini-orange': '#E84A27',
        'illini-blue': '#13294B',
        'illini-orange-light': '#FF6B35',
        'illini-blue-light': '#1B3A5F',
        'illini-cloud': '#F8F8F8',
      },
    },
  },
  plugins: [],
}
EOF

# postcss.config.js
cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

# tsconfig.node.json
cat > tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

# index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Illini Lost & Found</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# .env.example
cat > .env.example << 'EOF'
VITE_API_URL=http://localhost:5000/api
EOF

# src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

# src/styles/index.css
cat > src/styles/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

@layer components {
  .btn-primary {
    @apply bg-illini-orange hover:bg-illini-orange-light text-white font-semibold py-2 px-6 rounded-lg transition duration-300;
  }
  
  .btn-secondary {
    @apply bg-illini-blue hover:bg-illini-blue-light text-white font-semibold py-2 px-6 rounded-lg transition duration-300;
  }
  
  .btn-outline {
    @apply border-2 border-illini-orange text-illini-orange hover:bg-illini-orange hover:text-white font-semibold py-2 px-6 rounded-lg transition duration-300;
  }
  
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-illini-orange focus:border-transparent;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md hover:shadow-lg transition duration-300;
  }
}
EOF

# src/types/index.ts
cat > src/types/index.ts << 'EOF'
export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Item {
  _id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  date: string;
  imageUrl?: string;
  contactEmail: string;
  contactPhone?: string;
  status: 'active' | 'claimed' | 'expired';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Claim {
  _id: string;
  itemId: string;
  claimantId: string;
  description: string;
  verificationDetails: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceItem {
  _id: string;
  itemId: Item;
  price: number;
  status: 'available' | 'sold';
  listedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const CATEGORIES = [
  'Electronics',
  'Clothing',
  'Keys',
  'Books',
  'IDs',
  'Bags & Backpacks',
  'Accessories',
  'Sports Equipment',
  'Other'
];

export const LOCATIONS = [
  'Grainger Library',
  'Undergrad Library',
  'Union',
  'ARC',
  'CRCE',
  'Siebel Center',
  'ECEB',
  'Everitt Lab',
  'DCL',
  'Main Quad',
  'Engineering Quad',
  'Altgeld Hall',
  'Foellinger',
  'ISR',
  'PAR',
  'FAR',
  'Other'
];
EOF

# src/api/client.ts
cat > src/api/client.ts << 'EOF'
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
EOF

# src/api/auth.ts
cat > src/api/auth.ts << 'EOF'
import apiClient from './client';
import { AuthResponse, User } from '../types';

export const authAPI = {
  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', { email, password, name });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};
EOF

# src/api/items.ts
cat > src/api/items.ts << 'EOF'
import apiClient from './client';
import { Item } from '../types';

export const itemsAPI = {
  getAllItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/items');
    return response.data;
  },

  getItemsByType: async (type: 'lost' | 'found'): Promise<Item[]> => {
    const response = await apiClient.get(`/items?type=${type}`);
    return response.data;
  },

  getItemById: async (id: string): Promise<Item> => {
    const response = await apiClient.get(`/items/${id}`);
    return response.data;
  },

  searchItems: async (query: string): Promise<Item[]> => {
    const response = await apiClient.get(`/items/search?q=${query}`);
    return response.data;
  },

  createItem: async (itemData: Partial<Item>): Promise<Item> => {
    const response = await apiClient.post('/items', itemData);
    return response.data;
  },

  updateItem: async (id: string, itemData: Partial<Item>): Promise<Item> => {
    const response = await apiClient.put(`/items/${id}`, itemData);
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/items/${id}`);
  },

  getMyItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/items/my-items');
    return response.data;
  },
};
EOF

# src/api/claims.ts
cat > src/api/claims.ts << 'EOF'
import apiClient from './client';
import { Claim } from '../types';

export const claimsAPI = {
  createClaim: async (itemId: string, description: string, verificationDetails: string): Promise<Claim> => {
    const response = await apiClient.post('/claims', {
      itemId,
      description,
      verificationDetails,
    });
    return response.data;
  },

  getMyClaims: async (): Promise<Claim[]> => {
    const response = await apiClient.get('/claims/my-claims');
    return response.data;
  },

  getClaimsByItem: async (itemId: string): Promise<Claim[]> => {
    const response = await apiClient.get(`/claims/item/${itemId}`);
    return response.data;
  },
};
EOF

# src/api/marketplace.ts
cat > src/api/marketplace.ts << 'EOF'
import apiClient from './client';
import { MarketplaceItem } from '../types';

export const marketplaceAPI = {
  getAllItems: async (): Promise<MarketplaceItem[]> => {
    const response = await apiClient.get('/marketplace');
    return response.data;
  },

  listItem: async (itemId: string, price: number): Promise<MarketplaceItem> => {
    const response = await apiClient.post('/marketplace', { itemId, price });
    return response.data;
  },

  updateStatus: async (id: string, status: 'available' | 'sold'): Promise<MarketplaceItem> => {
    const response = await apiClient.patch(`/marketplace/${id}`, { status });
    return response.data;
  },
};
EOF

# src/api/admin.ts
cat > src/api/admin.ts << 'EOF'
import apiClient from './client';
import { Item, Claim, User } from '../types';

export const adminAPI = {
  getAllItems: async (): Promise<Item[]> => {
    const response = await apiClient.get('/admin/items');
    return response.data;
  },

  getAllClaims: async (): Promise<Claim[]> => {
    const response = await apiClient.get('/admin/claims');
    return response.data;
  },

  updateClaimStatus: async (claimId: string, status: 'approved' | 'rejected'): Promise<Claim> => {
    const response = await apiClient.patch(`/admin/claims/${claimId}`, { status });
    return response.data;
  },

  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/items/${id}`);
  },
};
EOF

# src/store/authStore.ts
cat > src/store/authStore.ts << 'EOF'
import { create } from 'zustand';
import { User } from '../types';
import { authAPI } from '../api/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const { token, user } = await authAPI.login(email, password);
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  register: async (email: string, password: string, name: string) => {
    const { token, user } = await authAPI.register(email, password, name);
    localStorage.setItem('token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    authAPI.logout();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await authAPI.getProfile();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
EOF

# Create placeholder App.tsx
cat > src/App.tsx << 'EOF'
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <h1 className="text-4xl font-bold text-illini-orange text-center py-8">
          Illini Lost & Found
        </h1>
        <p className="text-center text-gray-600">Frontend setup complete! Components coming next...</p>
      </div>
    </Router>
  );
}

export default App;
EOF

echo "✅ Configuration files created!"
echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Frontend setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "Next steps:"
echo "  1. Run 'npm run dev' to start the frontend"
echo "  2. Components and pages will be added next"