# DevLearn

## 📋 About

A modern blog platform for developers, inspired by TabNews. Built with Next.js and focused on clean, readable content.

## 🛠️ Technologies

- **Frontend**
  - Next.js 13
  - React 18
  - CSS-in-JS

- **Backend**
  - Node.js 18
  - PostgreSQL
  - node-pg-migrate

- **Testing**
  - Jest
  - Testing Library

- **DevOps**
  - Docker
  - Docker Compose
  - GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x
- Docker and Docker Compose
- PostgreSQL (or use provided Docker container)

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/tabnews.git
cd tabnews
```

2. Install dependencies

```bash
npm install
```

3. Create environment files

```bash
cp .env.example .env.development
cp .env.example .env.test
```

## 📝 Available Commands

### Development

```bash
# Start development server
npm run dev

# Start only services (database)
npm run services:up

# Stop services
npm run services:down

# Wait for database to be ready
npm run services:wait:database
```

### Database

```bash
# Run pending migrations
npm run migrations:up

# Rollback last migration
npm run migrations:down

# Create new migration
npm run migrations:create [migration-name]
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Run unit tests
npm run test:unit
```

### Production

```bash
# Build for production
npm run build

# Start production server
npm start

# Clean build files
npm run clean
```

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🗄️ Project Structure

```
tabnews/
├── components/     # React components
├── pages/         # Next.js pages
│   ├── api/       # API routes
│   └── ...        # Page components
├── infra/         # Infrastructure code
│   ├── database/  # Database configuration
│   └── migrations/# Database migrations
├── tests/         # Test files
│   ├── integration/
│   └── unit/
├── styles/        # Global styles
└── public/        # Static files
```

## 🔧 Environment Variables

Create .env.development and `.env.test` files with:

```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=local_user
POSTGRES_DB=local_db
POSTGRES_PASSWORD=local_password
JWT_SECRET=your-secret-key
```

## 🧪 Running Tests

The project uses Jest for testing. Tests are located in the tests directory.

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage
```

## 📦 Database Migrations

Migrations are handled with node-pg-migrate:

```bash
# Create new migration
npm run migrations:create my_migration_name

# Run pending migrations
npm run migrations:up

# Rollback last migration
npm run migrations:down
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
