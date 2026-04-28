# 📁 FarmDialogue Project Structure

Complete project organization and file structure documentation.

## 🏗️ Root Directory Structure

```
farmdialogue/
├── 📂 src/                        # Frontend Source (React/TypeScript)
├── 📂 back/                       # Backend Source (Node.js/Express)
├── 📂 docs/                       # Documentation
├── 📂 front/                      # Legacy frontend (archived)
├── 📂 archive/                    # Archived files
├── 📂 dist/                       # Build output
├── 📂 node_modules/               # Dependencies
├── 📄 package.json                # Frontend dependencies
├── 📄 README.md                   # Main project README
├── 📄 PROJECT_STRUCTURE.md        # This file
└── 📄 .gitignore                  # Git ignore rules
```

## 🎨 Frontend Structure (`src/`)

```
src/
├── 📂 components/                 # React Components
│   ├── 📂 dashboard/              # Dashboard-specific components
│   │   └── StatCard.tsx
│   ├── 📂 modals/                 # Modal dialogs
│   │   ├── AddProductModal.tsx    # Product creation
│   │   ├── EditProductModal.tsx   # Product editing
│   │   ├── AddUserModal.tsx       # User creation
│   │   ├── NewOrderModal.tsx      # Order creation
│   │   └── SendMessageModal.tsx   # Messaging
│   ├── 📂 ui/                     # UI primitives (shadcn/ui)
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── sidebar.tsx
│   │   └── toaster.tsx
│   ├── FileUpload.tsx             # File upload component
│   ├── OnlineStatusIndicator.tsx  # User status
│   └── RoleSwitcher.tsx           # Role switching
│
├── 📂 context/                    # React Context
│   ├── AuthContext.tsx            # Authentication state
│   ├── DataContext.tsx            # Application data
│   └── OnlineStatusContext.tsx    # Online status
│
├── 📂 data/                       # Data & Types
│   └── types.ts                   # TypeScript interfaces
│
├── 📂 hooks/                      # Custom React hooks
│
├── 📂 layouts/                    # Layout components
│   └── DashboardLayout.tsx        # Main dashboard layout
│
├── 📂 lib/                        # Utility libraries
│
├── 📂 pages/                      # Page components
│   └── 📂 dashboard/              # Dashboard pages
│       ├── Overview.tsx           # Dashboard home
│       ├── Orders.tsx             # Orders management
│       ├── Listings.tsx           # Product listings
│       ├── Messages.tsx           # Messaging
│       ├── Browse.tsx             # Browse products
│       ├── Settings.tsx           # User settings
│       ├── Users.tsx              # User management
│       ├── Marketplace.tsx        # Marketplace
│       └── Learning.tsx           # Learning hub
│
├── 📂 utils/                      # Utility functions
│   ├── fileUploadService.ts       # File upload utilities
│   └── aiAssistant.ts             # AI assistant
│
├── 📄 App.tsx                     # Main App component
├── 📄 main.tsx                    # Entry point
└── 📄 index.css                   # Global styles
```

## 🔧 Backend Structure (`back/`)

```
back/
├── 📂 src/                        # Source code
│   ├── 📂 config/                 # Configuration
│   │   ├── db.js                  # MongoDB connection
│   │   └── constants.js           # App constants
│   │
│   ├── 📂 controllers/            # Business logic
│   │   ├── authController.js      # Authentication
│   │   ├── userController.js      # User management
│   │   ├── productController.js   # Product management
│   │   ├── orderController.js     # Order management
│   │   ├── fileController.js      # File upload
│   │   └── contactController.js   # Contact forms
│   │
│   ├── 📂 models/                 # Database models
│   │   ├── User.js                # User schema
│   │   ├── Product.js             # Product schema
│   │   ├── Order.js               # Order schema
│   │   ├── File.js                # File metadata schema
│   │   ├── Message.js             # Message schema
│   │   └── Contact.js             # Contact schema
│   │
│   ├── 📂 routes/                 # API routes
│   │   ├── auth.js                # Auth endpoints
│   │   ├── users.js               # User endpoints
│   │   ├── products.js            # Product endpoints
│   │   ├── orders.js              # Order endpoints
│   │   ├── files.js               # File endpoints
│   │   └── contact.js             # Contact endpoints
│   │
│   ├── 📂 middleware/             # Express middleware
│   │   └── auth.js                # JWT verification
│   │
│   ├── 📂 services/               # External services
│   │   └── emailService.js        # Email sending
│   │
│   ├── 📂 utils/                  # Utility functions
│   │   ├── responseUtils.js       # Response helpers
│   │   └── fileUtils.js           # File helpers
│   │
│   └── 📄 app.js                  # Express app setup
│
├── 📂 uploads/                    # File storage
│   ├── 📂 profile/                # Profile pictures
│   ├── 📂 product/                # Product images
│   ├── 📂 message/                # Message attachments
│   └── 📂 document/               # Documents
│
├── 📄 server.js                   # Server entry point
├── 📄 package.json                # Backend dependencies
├── 📄 .env.example                # Environment template
├── 📄 README.md                   # Backend README
├── 📄 FILE_UPLOAD_SETUP.md        # Upload system docs
├── 📄 seed-admin.js               # Database seeding
└── 📄 test-file-upload.js         # Upload tests
```

## 📚 Documentation Structure (`docs/`)

```
docs/
├── 📂 api/                        # API Documentation
│   └── BACKEND_INTEGRATION.md     # Complete API reference
│
├── 📂 guides/                     # User Guides
│   ├── COLLABORATOR_GUIDE.md      # Quick start guide
│   ├── QUICK_REFERENCE.md         # Quick reference
│   └── BACKEND_CHECKLIST.md       # Integration checklist
│
├── 📂 setup/                      # Setup Guides
│   └── FILE_UPLOAD_COMPLETE.md    # File upload setup
│
├── 📄 README.md                   # Documentation index
├── 📄 IMPLEMENTATION_SUMMARY.md   # Implementation overview
├── 📄 PROJECT_STATUS.md           # Project status
├── 📄 SCRUM.md                    # Agile documentation
├── 📄 DEPLOYMENT.md               # Deployment guide
├── 📄 SETUP_LOCAL.md              # Local setup
└── 📄 VENDOR_DASHBOARD_FEATURES.md # Feature docs
```

## 🗂️ Key Files

### Configuration Files
- `package.json` - Frontend dependencies and scripts
- `back/package.json` - Backend dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - TailwindCSS configuration
- `back/.env.example` - Environment variables template

### Entry Points
- `src/main.tsx` - Frontend entry point
- `back/server.js` - Backend entry point
- `index.html` - HTML entry point

### Documentation
- `README.md` - Main project documentation
- `docs/README.md` - Documentation index
- `PROJECT_STRUCTURE.md` - This file

## 📦 Dependencies

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Radix UI** - UI components
- **Lucide React** - Icons

### Backend
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Nodemailer** - Email sending

## 🔐 Environment Variables

### Backend (`.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/farmdialogue
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads
FRONTEND_URL=http://localhost:5173
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000
```

## 🚀 Build Output

### Frontend Build (`dist/`)
```
dist/
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other assets]
└── index.html
```

### Backend (No build required)
- Node.js runs directly from source

## 📝 Naming Conventions

### Files
- **React Components**: PascalCase (e.g., `FileUpload.tsx`)
- **Utilities**: camelCase (e.g., `fileUploadService.ts`)
- **Backend Files**: camelCase (e.g., `fileController.js`)
- **Documentation**: SCREAMING_SNAKE_CASE (e.g., `README.md`)

### Directories
- **Frontend**: camelCase (e.g., `components/`)
- **Backend**: camelCase (e.g., `controllers/`)
- **Documentation**: lowercase (e.g., `docs/`)

### Code
- **Variables**: camelCase (e.g., `userId`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)
- **Classes**: PascalCase (e.g., `FileUpload`)
- **Functions**: camelCase (e.g., `uploadFile`)

## 🔍 Finding Files

### Need to find...
- **React component?** → `src/components/`
- **API endpoint?** → `back/src/routes/`
- **Database model?** → `back/src/models/`
- **Business logic?** → `back/src/controllers/`
- **Utility function?** → `src/utils/` or `back/src/utils/`
- **Documentation?** → `docs/`
- **Configuration?** → Root or `back/src/config/`

## 🧹 Clean Code Practices

### Frontend
- One component per file
- Co-locate related files
- Use TypeScript interfaces
- Implement proper error handling
- Use custom hooks for logic

### Backend
- Separate concerns (MVC pattern)
- Use middleware for cross-cutting concerns
- Centralize configuration
- Implement proper error handling
- Use utility functions

### Documentation
- Keep docs up to date
- Use clear examples
- Include code snippets
- Provide troubleshooting guides

## 📊 File Statistics

- **Total Files**: ~150+
- **Frontend Components**: ~30+
- **Backend Controllers**: 6
- **Database Models**: 6
- **API Routes**: 6
- **Documentation Files**: 15+
- **Lines of Code**: ~15,000+

## 🔄 Version Control

### Git Structure
```
.git/
├── branches/
├── hooks/
├── objects/
└── refs/
```

### Important Git Files
- `.gitignore` - Ignored files
- `.github/` - GitHub workflows

## 🎯 Best Practices

1. **Keep structure flat** - Avoid deep nesting
2. **Group by feature** - Related files together
3. **Clear naming** - Self-documenting names
4. **Consistent style** - Follow conventions
5. **Document changes** - Update docs with code

---

**Last Updated:** April 28, 2026
**Structure Version:** 2.0
**Status:** Production Ready
