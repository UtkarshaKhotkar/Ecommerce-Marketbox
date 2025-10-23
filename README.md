# E-Commerce Platform

A production-quality, full-stack e-commerce platform built with modern technologies for portfolio demonstration.

## 🚀 Features

- **Frontend**: React 18 + TypeScript, TailwindCSS, React Router, React Query
- **Backend**: Node.js + Express + TypeScript, RESTful API
- **Database**: MySQL with TypeORM, migrations, and seed data
- **Authentication**: JWT with refresh tokens, role-based access control
- **Payments**: Stripe integration ready (webhook support)
- **Testing**: Jest, React Testing Library, comprehensive test coverage
- **Deployment**: Vercel (frontend), Railway (backend), PlanetScale (database)
- **CI/CD**: GitHub Actions with automated testing and deployment
- **Performance**: Lighthouse optimized, accessibility compliant
- **Security**: Helmet, CORS, rate limiting, input validation

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- TailwindCSS for styling
- React Router for navigation
- React Query for data fetching
- React Hook Form for forms
- Axios for API calls
- Jest + React Testing Library for testing

### Backend
- Node.js + Express + TypeScript
- TypeORM for database management
- JWT authentication with refresh tokens
- Stripe for payment processing
- Input validation with Zod
- Winston for logging
- Helmet for security
- Rate limiting and CORS

### Database
- MySQL with TypeORM
- Migrations and seed scripts
- Role-based access control (User, Seller, Admin)
- Optimized indexes for performance

### DevOps & Tools
- Docker & Docker Compose for local development
- GitHub Actions for CI/CD
- ESLint + Prettier for code quality
- Husky for pre-commit hooks
- Semantic commit messages

## 🚦 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose
- Git

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/ecommerce-platform.git
cd ecommerce-platform
npm install
```

### 2. Environment Setup
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit backend/.env with your values:
# - Generate JWT secrets (use: openssl rand -base64 32)
# - Add Stripe keys (get from Stripe dashboard)
# - Configure email settings
```

### 3. Start Development Environment
```bash
# Start MySQL and Redis with Docker
npm run docker:up

# Build shared package
npm run build:shared

# Start both frontend and backend
npm run dev
```

### 4. Seed Database (Optional)
```bash
cd backend
npm run seed
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- Database Admin: http://localhost:8080 (Adminer)

## 📋 Environment Variables

### Backend (.env)
```bash
# Environment
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=mysql://root:password@localhost:3306/ecommerce

# JWT (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production

# Stripe (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🏗 Project Structure

```
ecommerce-platform/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts (Auth, Cart)
│   │   ├── services/        # API service layer
│   │   ├── hooks/           # Custom React hooks
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── models/          # TypeORM entities
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── database/        # DB config, migrations, seeds
│   │   └── utils/           # Utility functions
│   └── package.json
├── shared/                   # Shared types and utilities
│   ├── src/
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Shared utility functions
│   └── package.json
├── .github/workflows/        # GitHub Actions CI/CD
├── docker-compose.yml        # Local development services
└── package.json             # Root package.json (workspaces)
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main

### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main

### Database (PlanetScale)
1. Create a PlanetScale database
2. Update DATABASE_URL in production environment
3. Run migrations: `npm run migration:run`

### Environment Variables for Production
Set these in your deployment platforms:

**Vercel (Frontend):**
- `VITE_API_URL`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_GOOGLE_CLIENT_ID`

**Railway (Backend):**
- All backend environment variables
- Use production values for Stripe, database, etc.

## 📊 Features Implemented

### ✅ Core Features
- [x] User authentication (register, login, JWT)
- [x] Product catalog with search and filters
- [x] Shopping cart functionality
- [x] Category management
- [x] Responsive design
- [x] Role-based access control
- [x] API documentation
- [x] Database migrations and seeds
- [x] Error handling and validation
- [x] Logging and monitoring setup

### 🚧 Advanced Features (Ready for Implementation)
- [ ] Stripe payment integration
- [ ] Order management system
- [ ] Email notifications
- [ ] Google OAuth integration
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Admin dashboard
- [ ] Real-time notifications
- [ ] Image upload and optimization
- [ ] Advanced search with Elasticsearch

## 🔧 Development Commands

```bash
# Install dependencies
npm install

# Development
npm run dev                    # Start both frontend and backend
npm run dev:frontend          # Start frontend only
npm run dev:backend           # Start backend only

# Building
npm run build                 # Build all packages
npm run build:frontend        # Build frontend
npm run build:backend         # Build backend
npm run build:shared          # Build shared package

# Database
npm run migration:generate    # Generate new migration
npm run migration:run         # Run migrations
npm run seed                  # Seed database

# Docker
npm run docker:up             # Start services
npm run docker:down           # Stop services

# Testing & Quality
npm run test                  # Run all tests
npm run lint                  # Lint all code
npm run lint:fix              # Fix linting issues
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 API Documentation

When running the backend, visit http://localhost:3001/api/docs for interactive API documentation.

### Key Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/products` - Get products with filters
- `GET /api/categories` - Get categories
- `POST /api/orders` - Create order
- `POST /api/payments/create-intent` - Create payment intent

## 🔒 Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt
- Input validation with Zod
- Rate limiting
- CORS configuration
- Helmet security headers
- SQL injection prevention (TypeORM)
- XSS protection

## 📈 Performance Optimizations

- Database indexing
- Query optimization
- Image optimization ready
- Caching strategies implemented
- Bundle splitting (Vite)
- Lazy loading components
- Lighthouse performance optimized

## 🎯 Portfolio Highlights

This project demonstrates:
- **Full-stack development** with modern technologies
- **Production-ready code** with proper error handling
- **Scalable architecture** with clean separation of concerns
- **Security best practices** and authentication
- **Testing strategies** with comprehensive coverage
- **DevOps practices** with CI/CD and containerization
- **Performance optimization** and accessibility
- **Code quality** with linting, formatting, and type safety

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have questions or need help with setup, please open an issue or contact me directly.