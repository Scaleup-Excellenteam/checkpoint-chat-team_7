# 💬 Modern Chat Application

A full-stack real-time chat application built with React, Node.js, and WebSocket technology. Features modern UI design, real-time messaging, group conversations, and comprehensive security measures.

## 🚀 Features

### Frontend Features

- **Modern UI Design** - Glassmorphism effects, gradient backgrounds, and smooth animations
- **Real-time Messaging** - Instant message delivery using WebSocket connections
- **Group Conversations** - Create and manage group chats
- **User Authentication** - Secure login and registration system
- **Groups Search** - Search through conversations
- **Modern Components** - Card-based layouts with hover effects and transitions

### Backend Features

- **RESTful API** - Clean API endpoints for user management and conversations
- **WebSocket Server** - Real-time bidirectional communication
- **Security Validation** - Multi-layer message validation and sanitization
- **Blacklist System** - Configurable word and domain blacklists
- **Credit Card Detection** - Automatic detection and blocking of credit card numbers
- **JWT Authentication** - Secure token-based authentication
- **MongoDB Integration** - Persistent data storage

## 🛠️ Technology Stack

### Frontend

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **React Bootstrap** - UI component library
- **Axios** - HTTP client for API calls
- **WebSocket** - Real-time communication
- **DOMPurify** - HTML sanitization
- **Vite** - Fast build tool and dev server

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **WebSocket (ws)** - Real-time communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running the application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd checkpoint-project/Demo-Chat
```

### 2. Install Dependencies

#### Frontend Dependencies

```bash
cd myapp
npm install
```

#### Backend Dependencies

```bash
cd ../server
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your-secret-key-here
PORT=3000
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (if running locally)
mongod
```

### 5. Start the Application

#### Start the Backend Server

```bash
cd server
npm start
# or for development with auto-restart
npm run dev
```

#### Start the Frontend Development Server

```bash
cd myapp
npm run dev
```

The application will be available at:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🔒 Security Features

### Message Validation Pipeline

Every message sent through the chat system goes through multiple security checks:

#### 1. **Frontend Validation** (`purify.js`)

- **Empty Message Check** - Prevents sending empty or whitespace-only messages
- **Length Validation** - Maximum message length of 200 characters
- **HTML Sanitization** - Uses DOMPurify to clean HTML content

#### 2. **Backend Validation** (`webSocketChecks.js`)

- **Empty Message Check** - Server-side validation of message content
- **Length Validation** - Enforces maximum message length
- **HTML Sanitization** - Additional server-side sanitization
- **Blacklist Check** - Validates against configurable word and domain blacklists
- **Credit Card Detection** - Uses Luhn algorithm to detect and block credit card numbers

### Blacklist System

The application includes a comprehensive blacklist system that can block:

- **Forbidden Words** - Customizable list of blocked words
- **Blocked Domains** - URLs from specific domains
- **Credit Card Numbers** - Automatic detection using Luhn algorithm validation

### Authentication Security

- **JWT Tokens** - Secure token-based authentication
- **Password Hashing** - bcrypt encryption for password storage
- **Session Management** - Secure session handling

## 📁 Project Structure

```
Demo-Chat/
├── myapp/                          # Frontend React Application
│   ├── src/
│   │   ├── components/             # React Components
│   │   │   ├── AllConversations.jsx
│   │   │   ├── Conversation.jsx
│   │   │   ├── ConversationDetails.jsx
│   │   │   ├── Message.jsx
│   │   │   └── NewConversation.jsx
│   │   ├── pages/                  # Page Components
│   │   │   ├── Login.jsx
│   │   │   ├── Create.jsx
│   │   │   └── Main.jsx
│   │   ├── CSS/                    # Component-specific Styles
│   │   │   ├── Login.css
│   │   │   ├── Create.css
│   │   │   ├── Main.css
│   │   │   ├── AllConversations.css
│   │   │   ├── Conversation.css
│   │   │   ├── Message.css
│   │   │   ├── ConversationDetails.css
│   │   │   └── NewConversation.css
│   │   ├── constants/              # Configuration Files
│   │   │   ├── APIs.js
│   │   │   └── purify.js
│   │   └── redux/                  # State Management
│   └── package.json
├── server/                         # Backend Node.js Application
│   ├── BLL/                        # Business Logic Layer
│   │   ├── usersBLL.js
│   │   ├── convBLL.js
│   │   └── blacklistsBLL.js
│   ├── models/                     # Database Models
│   │   ├── usersModel.js
│   │   ├── conversationModel.js
│   │   └── blackLists.js
│   ├── routers/                    # API Routes
│   │   ├── authRouter.js
│   │   ├── usersRouter.js
│   │   ├── convRouter.js
│   │   └── blacklistsRouter.js
│   ├── utils/                      # Utility Functions
│   │   └── webSocketChecks.js
│   └── package.json
└── README.md
```

## 🎨 UI/UX Features

### Modern Design Elements

- **Glassmorphism Effects** - Frosted glass appearance with backdrop blur
- **Gradient Backgrounds** - Beautiful color gradients throughout the interface
- **Smooth Animations** - Hover effects, transitions, and micro-interactions
- **Card-based Layout** - Clean, organized interface with card components
- **Responsive Design** - Optimized for all screen sizes

### Component Features

- **Login/Signup Pages** - Modern form design with validation feedback
- **Chat Interface** - Clean message bubbles with proper alignment
- **Conversation List** - Sidebar with search functionality
- **Group Creation** - Modal dialog for creating new groups
- **Message Input** - Modern input field with send button

## 🔧 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/access` - Verify access token

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID

### Conversations

- `GET /conversations` - Get all conversations
- `POST /conversations` - Create new conversation
- `GET /conversations/:id` - Get conversation by ID

### Blacklists

- `GET /blacklists` - Get all blacklists
- `POST /blacklists` - Create new blacklist
- `PUT /blacklists/:id` - Update blacklist
- `DELETE /blacklists/:id` - Delete blacklist

## 🚀 Deployment

### Frontend Deployment

```bash
cd myapp
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment

```bash
cd server
npm start
# Deploy to your server with PM2 or similar process manager
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

## 🔮 Future Enhancements

- [ ] File sharing capabilities
- [ ] Emoji reactions
- [ ] Message encryption
- [ ] Voice messages
- [ ] Video calls
- [ ] Push notifications
- [ ] Message threading
- [ ] User presence indicators
- [ ] Message editing and deletion
- [ ] Advanced search filters

---

**Built with ❤️ using React, Node.js, and WebSocket technology**
