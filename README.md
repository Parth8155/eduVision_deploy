# eduVision - Smart Study Platform

<div align="center">

![eduVision Logo](favicon.png)

A modern, intelligent study platform that transforms how students interact with their notes and study materials through advanced OCR, AI-powered study tools, and seamless PDF annotation capabilities.

[![React](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.0-646cff?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38b2ac?logo=tailwind-css)](https://tailwindcss.com/)
[![Azure](https://img.shields.io/badge/Deployed_on-Azure-0078d4?logo=microsoft-azure)](https://azure.microsoft.com/)

</div>

## 🚀 Features

### 📝 Smart Note Management
- **PDF Annotation**: Interactive PDF viewer with highlighting and note-taking capabilities
- **OCR Technology**: Extract text from handwritten notes with high accuracy
- **Personal Notes**: Create, edit, and organize notes with tags and color coding
- **Search & Filter**: Powerful search functionality across all your study materials

### 🧠 AI-Powered Study Tools
- **Automatic Summaries**: Generate concise summaries from your notes
- **MCQ Generation**: Create multiple-choice questions for self-assessment
- **Practice Questions**: Generate practice questions to test your understanding
- **Study Material Organization**: Categorize and track your generated content

### 📚 Library Management
- **Organized Storage**: Keep all study materials in a structured library
- **Subject Categorization**: Organize notes by subjects and folders
- **Star System**: Mark important materials for quick access
- **Progress Tracking**: Monitor your study progress and performance

### 👤 User Experience
- **Dark/Light Theme**: Toggle between themes for comfortable studying
- **Responsive Design**: Works seamlessly across desktop, tablet, and mobile devices
- **Real-time Sync**: All your data syncs across devices
- **Secure Authentication**: Robust login system with password reset functionality

## 🛠️ Technology Stack

### Frontend
- **React 19.1.0** - Modern React with latest features
- **Vite 7.0.0** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Radix UI** - Accessible, unstyled UI components
- **React Router 7.6.3** - Client-side routing

### Key Libraries
- **PDF.js 3.11.174** - PDF rendering and manipulation
- **React PDF Viewer** - PDF annotation and viewing components
- **Lucide React** - Beautiful, customizable icons
- **React Hook Form** - Performant form handling
- **React Toastify** - Elegant toast notifications
- **Recharts** - Data visualization and charts

### Development Tools
- **ESLint** - Code linting and quality assurance
- **PostCSS & Autoprefixer** - CSS processing
- **Vite Plugin React** - React support for Vite

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18.x or higher)
- **npm** (version 9.x or higher)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Parth8155/eduVision_deploy.git
cd eduVision_deploy
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api
VITE_API_URL=https://eduvision-g0evbghwhyb8apb4.westindia-01.azurewebsites.net/api

# Application Configuration
VITE_APP_NAME=eduVision
VITE_APP_VERSION=1.0.0
```

### 4. Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
npm run build
```

The built files will be in the `build` directory.

### 6. Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Getting Started
1. **Sign Up**: Create a new account or log in with existing credentials
2. **Upload Notes**: Use the upload feature to add PDFs or handwritten notes
3. **Take Notes**: Annotate PDFs and create personal notes
4. **Generate Study Materials**: Use AI tools to create summaries and questions
5. **Organize**: Use the library to organize and manage your study materials

### Key Features Walkthrough

#### PDF Annotation
- Open any PDF in the notes viewer
- Click and drag to highlight text
- Add annotations and personal notes
- Save annotations for future reference

#### Study Tools
- Navigate to Study Tools section
- Select source material (notes or PDFs)
- Choose generation type: Summary, MCQ, or Practice Questions
- Review and save generated content

#### Library Management
- Browse all your study materials
- Use filters to find specific content
- Star important materials
- Organize by subjects and folders

## 🔧 Development

### Project Structure

```
eduVision_deploy/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable React components
│   │   ├── notes/        # Note-taking components
│   │   └── ui/           # UI components
│   ├── contexts/         # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Application pages/routes
│   ├── services/        # API service layers
│   └── utils/           # Utility functions
├── build/               # Production build output
└── package.json        # Dependencies and scripts
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint (uses flat config) |

> **Note:** The project uses ESLint v9 with flat configuration format. Some warnings about configuration format may appear but won't affect the build process.

### Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **Styling**: Utilize Tailwind CSS for consistent styling
3. **State Management**: Use React Context for global state
4. **API Calls**: Centralize API logic in service files
5. **Type Safety**: Follow TypeScript-like patterns with PropTypes

## 🚢 Deployment

The application is configured for Azure Static Web Apps deployment:

### Azure Configuration
- Build Command: `npm run build`
- Build Output: `build`
- Configuration: `staticwebapp.config.json`

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `build` directory to your hosting provider

3. Configure environment variables on your hosting platform

## 🔐 API Integration

The application integrates with a backend API for:

- **User Authentication** (`/auth`)
- **Note Management** (`/notes`)
- **User Notes** (`/user-notes`)
- **Study Tools** (`/study-tools`)
- **File Upload** (`/upload`)

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /auth/login` | User authentication |
| `POST /auth/register` | User registration |
| `GET /notes` | Fetch user notes |
| `POST /user-notes` | Create personal notes |
| `POST /study-tools/generate` | Generate study materials |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style
- Follow ESLint configurations
- Use meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
- Ensure Node.js version is 18.x or higher
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Linting Issues:**
- The project uses ESLint v9 with flat config format
- Some legacy config formats may cause warnings, but builds will still succeed
- To fix linting: ensure all plugins are updated to support flat config

**PDF Loading Issues:**
- Check network connectivity
- Verify API endpoint configuration
- Ensure proper authentication

**Authentication Problems:**
- Clear browser storage
- Check API base URL configuration
- Verify backend service status

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Team](https://reactjs.org/) for the amazing framework
- [Vite Team](https://vitejs.dev/) for the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering capabilities

## 📞 Support

For support, email [support@eduvision.com](mailto:support@eduvision.com) or open an issue on GitHub.

---

<div align="center">
Made with ❤️ by the eduVision Team
</div>