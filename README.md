# ClassSync - Assignment Management System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8+-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19+-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, full-stack web application for managing assignments between teachers and students. Built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript for type safety and better development experience.

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based authentication** with secure token management
- **Role-based access control** (Teacher/Student)
- **Password hashing** with bcrypt
- **Protected routes** with middleware

### 📚 Assignment Management
- **Create and manage assignments** with rich text descriptions
- **File attachments** support for assignment materials
- **Due date tracking** with automatic notifications
- **Assignment status** monitoring

### 📝 Submission System
- **File upload** for student submissions
- **Submission history** tracking
- **Grading system** with feedback
- **Late submission** handling

### 🔔 Notification Center
- **Real-time notifications** for new assignments
- **Due date reminders**
- **Grading notifications**
- **Read/unread status** tracking

### 🎨 Modern UI/UX
- **Responsive design** that works on all devices
- **Material-UI components** for consistent styling
- **Dark/Light theme** support
- **Intuitive navigation** and user experience

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (v6 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/classsync.git
   cd classsync
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example files
   cd ../server
   cp env.example .env
   
   # Edit .env with your configuration
   # See Environment Variables section below
   ```

4. **Start the development servers**
   ```bash
   # Start backend server (from server directory)
   npm run dev
   
   # Start frontend server (from client directory, in new terminal)
   cd ../client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## ⚙️ Environment Variables

### Backend (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/classsync

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📁 Project Structure

```
classsync/
├── server/                 # Backend API
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Server entry point
│   ├── uploads/            # File uploads directory
│   ├── dist/               # Compiled JavaScript
│   ├── package.json        # Dependencies and scripts
│   ├── tsconfig.json       # TypeScript configuration
│   └── env.example         # Environment variables template
├── client/                 # Frontend React App
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utility functions
│   │   └── main.tsx        # App entry point
│   ├── public/             # Static assets
│   ├── package.json        # Dependencies and scripts
│   ├── vite.config.ts      # Vite configuration
│   └── tsconfig.json       # TypeScript configuration
├── README.md               # Project documentation
└── .gitignore             # Git ignore rules
```

## 🛠️ Available Scripts

### Backend (server/)
```bash
npm run dev      # Start development server with nodemon
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
npm test         # Run tests (placeholder)
```

### Frontend (client/)
```bash
npm run dev      # Start development server with Vite
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create new assignment (teacher only)
- `GET /api/assignments/:id` - Get assignment details
- `PUT /api/assignments/:id` - Update assignment (teacher only)
- `DELETE /api/assignments/:id` - Delete assignment (teacher only)

### Submissions
- `GET /api/submissions` - Get user submissions
- `POST /api/submissions` - Submit assignment
- `GET /api/submissions/:id` - Get submission details
- `PUT /api/submissions/:id/grade` - Grade submission (teacher only)

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the TypeScript code: `npm run build`
2. Set production environment variables
3. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your preferred platform

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material-UI](https://mui.com/) for the beautiful UI components
- [Vite](https://vitejs.dev/) for the fast build tool
- [MongoDB](https://www.mongodb.com/) for the database
- [Express.js](https://expressjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework

## 📞 Support

If you have any questions or need help:
- Open an [issue](https://github.com/yourusername/classsync/issues)
- Check the [documentation](https://github.com/yourusername/classsync/wiki)
- Contact the maintainers

---

**Made with ❤️ for better education management** 