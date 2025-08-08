# MindGuard - Mental Health Monitoring Platform

**AI-powered mental health risk assessment and monitoring platform for early detection and personalized care.**

MindGuard is a comprehensive full-stack web application that helps users assess their mental health risk level through an intelligent questionnaire powered by machine learning. The platform provides personalized recommendations and tracks mental health trends over time.

## 🌟 Features

### 🔐 Secure Authentication
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes and session management
- Input validation and error handling

### 📊 Interactive Dashboard
- Visual risk meter with traffic-light system (Green/Yellow/Red)
- Real-time mental health risk assessment
- Assessment history and trend analysis
- Personalized recommendations based on AI analysis

### 🤖 AI-Powered Risk Assessment
- Machine learning model using Random Forest algorithm
- 10-factor mental health evaluation including:
  - Sleep patterns
  - Anxiety and stress levels
  - Social support system
  - Work-life balance
  - Physical activity
  - Substance use patterns
  - Mood changes
  - Financial stress
  - Suicidal ideation

### 📈 Progress Tracking
- Historical assessment data
- Risk level trends over time
- Confidence scoring for predictions
- Detailed submission history

### 🆘 Crisis Resources
- Emergency contact information
- Crisis hotline numbers
- Immediate help resources
- Safety recommendations for high-risk users

## 🏗️ Architecture

```
Frontend (React + TypeScript)
    ↕️
Backend (Node.js + Express + MongoDB)
    ↕️
ML Service (Python + Flask + scikit-learn)
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **express-rate-limit** for API protection
- **helmet** for security headers

### Machine Learning
- **Python 3.8+** with Flask
- **scikit-learn** for ML algorithms
- **Random Forest Classifier** for risk prediction
- **StandardScaler** for feature normalization
- **NumPy** for numerical computations

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+ and pip
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd mindguard
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
The frontend will be available at `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start backend server
npm run dev
```
The backend API will be available at `http://localhost:3001`

### 4. ML Service Setup
```bash
# Navigate to ML directory
cd ml-model

# Install Python dependencies
pip install -r requirements.txt

# Train the model (optional - model is included)
python train_model.py

# Start ML API server
python app.py
```
The ML API will be available at `http://localhost:5000`

### 5. Database Setup
Make sure MongoDB is running and update the connection string in `backend/.env`:
```
MONGODB_URI=mongodb://localhost:27017/mindguard
```

## 📁 Project Structure

```
mindguard/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   │   ├── AssessmentForm.tsx   # Mental health questionnaire
│   │   ├── RiskMeter.tsx        # Visual risk indicator
│   │   └── ProtectedRoute.tsx   # Route protection
│   ├── pages/                   # Main application pages
│   │   ├── Login.tsx            # User authentication
│   │   ├── Register.tsx         # User registration
│   │   └── Dashboard.tsx        # Main dashboard
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication state
│   ├── services/                # API service layer
│   │   └── api.ts               # HTTP client and API calls
│   └── types/                   # TypeScript type definitions
│       └── index.ts             # Application types
├── backend/                     # Node.js backend server
│   ├── models/                  # MongoDB data models
│   │   ├── User.js              # User schema
│   │   └── Submission.js        # Assessment submission schema
│   ├── routes/                  # API route handlers
│   │   ├── auth.js              # Authentication routes
│   │   └── assessment.js        # Assessment routes
│   ├── middleware/              # Express middleware
│   │   └── auth.js              # JWT authentication middleware
│   └── server.js                # Main server file
├── ml-model/                    # Python ML service
│   ├── app.py                   # Flask API server
│   ├── train_model.py           # Model training script
│   ├── model.pkl                # Trained ML model
│   ├── scaler.pkl               # Feature scaler
│   └── requirements.txt         # Python dependencies
└── README.md                    # Project documentation
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```bash
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mindguard
JWT_SECRET=your_super_secret_jwt_key_here
FRONTEND_URL=http://localhost:5173
ML_API_URL=http://localhost:5000
```

#### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3001/api
```

## 🧪 Demo Account

For testing purposes, you can use the demo account:
- **Email**: test@mindguard.com
- **Password**: Test@123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Assessment
- `POST /api/assessment/submit` - Submit mental health assessment (protected)
- `GET /api/assessment/history` - Get assessment history (protected)

### ML Service
- `POST /predict` - Get risk prediction from ML model
- `GET /health` - ML service health check

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: express-validator for all inputs
- **Rate Limiting**: API request throttling
- **CORS Protection**: Configured for specific origins
- **Helmet**: Security headers middleware
- **Data Sanitization**: MongoDB injection prevention

## 🎯 Mental Health Assessment

The platform evaluates mental health risk using 10 key factors:

1. **Sleep Hours** (0-12): Sleep duration and quality
2. **Anxiety Level** (1-10): Frequency of anxious feelings
3. **Stress Frequency** (1-10): How often stress is experienced
4. **Financial Stress** (1-10): Money-related anxiety
5. **Social Support** (1-10): Strength of support network
6. **Work-Life Balance** (1-10): Balance between work and personal life
7. **Physical Activity** (1-10): Exercise and movement frequency
8. **Substance Use** (1-10): Alcohol/drug usage patterns
9. **Mood Changes** (1-10): Emotional stability
10. **Suicidal Thoughts** (1-10): Self-harm ideation frequency

### Risk Categories

- **Low Risk (Green)**: Score ≤ 30 - Healthy mental state
- **Medium Risk (Yellow)**: Score 31-60 - Some concerns present
- **High Risk (Red)**: Score > 60 - Professional help recommended

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Render)
```bash
# Set environment variables
# Deploy backend/ folder
```

### ML Service (Railway/Render)
```bash
# Set Python environment
# Deploy ml-model/ folder
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Crisis Resources

If you or someone you know is experiencing a mental health crisis:

- **National Suicide Prevention Lifeline**: 988 or 1-800-273-8255
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

## 🙏 Acknowledgments

- **scikit-learn**: For providing excellent machine learning algorithms
- **React Community**: For the amazing ecosystem and components
- **MongoDB**: For flexible and scalable database solutions
- **Flask**: For lightweight and powerful API development

---

**Built with ❤️ for mental health awareness and early intervention**

*Making mental health monitoring accessible, private, and actionable for everyone.*