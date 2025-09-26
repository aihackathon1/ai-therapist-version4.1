# AI Therapist - Comprehensive Mood Tracking & Analytics Platform

A sophisticated AI-powered mental health platform that combines intelligent chat therapy with advanced mood tracking and analytics. Built with Next.js, Supabase, and OpenAI integration.

## 🌟 Features

### 🤖 AI Chat Integration
- **Real-time Sentiment Analysis**: Automatically detects emotions from chat conversations
- **Mood-Aware Responses**: AI therapist adapts responses based on detected emotional state
- **Session Tracking**: Comprehensive logging of all therapy sessions
- **Emotional State Classification**: Automatic mood detection with confidence scores

### 📊 Advanced Mood Tracking
- **Dual Input System**: Manual mood entry + AI-detected moods
- **8 Mood Types**: Angry, Anxious, Sad, Neutral, Happy, Calm, Stressed, Grateful
- **Intensity Rating**: 1-100 scale with visual sliders
- **Context Notes**: Optional notes and triggers
- **Source Tracking**: Distinguish between manual, AI-detected, and chat-analyzed entries

### 📈 Comprehensive Dashboard
- **Real-time Analytics**: Live mood trends and patterns
- **Visual Charts**: Interactive graphs showing mood distribution and trends
- **Chat Insights**: Session effectiveness and topic analysis
- **Progress Tracking**: Mood improvement over time
- **Streak Counter**: Daily mood tracking consistency

### 📅 Historical View
- **Calendar Interface**: Visual mood calendar with emoji indicators
- **Date Selection**: Click any date to view detailed mood entries
- **Export Functionality**: Download mood data as CSV
- **Pattern Recognition**: Weekly and monthly mood patterns

### 💡 Personalized Recommendations
- **Mood-Based Suggestions**: Tailored activities based on current emotional state
- **Multiple Categories**: Breathing, exercise, mindfulness, journaling, social, professional
- **Progress Tracking**: Mark recommendations as completed
- **Adaptive Learning**: Suggestions improve based on user patterns

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Charts**: Recharts
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o-mini
- **Authentication**: Supabase Auth
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-therapist-version4.1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL schema from `lib/supabase/schema.sql` in your Supabase SQL editor
   - Enable Row Level Security (RLS) policies

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
ai-therapist-version4.1/
├── app/
│   ├── (auth)/                 # Authentication pages
│   ├── api/                    # API routes
│   │   ├── chat/              # Chat API with mood analysis
│   │   ├── mood/              # Mood tracking API
│   │   └── analytics/         # Analytics API
│   ├── dashboard/             # Main dashboard page
│   ├── mood-tracking/         # Mood tracking page
│   └── globals.css            # Global styles
├── components/
│   ├── MoodCalendar.tsx       # Calendar view component
│   ├── MoodRecommendations.tsx # Recommendations component
│   └── ...                    # Other UI components
├── lib/
│   ├── supabase/              # Supabase client configuration
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Utility functions
└── docs/                      # Documentation
```

## 🔧 API Endpoints

### Chat API (`/api/chat`)
- **POST**: Send messages to AI therapist
- **Features**: Real-time sentiment analysis, mood detection, session tracking

### Mood API (`/api/mood`)
- **GET**: Retrieve mood entries with pagination
- **POST**: Create new mood entries
- **Features**: Database integration, user authentication

### Analytics API (`/api/analytics`)
- **GET**: Retrieve mood analytics and insights
- **Features**: Mood trends, improvement metrics, distribution data

## 🎨 Key Components

### MoodTracking Page
- Interactive mood selection with emojis
- AI-detected mood suggestions
- Intensity rating slider
- Notes and context input
- Recent entries display
- Calendar view toggle
- Data export functionality

### Dashboard Page
- Real-time mood analytics
- Interactive charts and graphs
- Chat session insights
- Personalized recommendations
- Progress tracking
- Journey summary

### MoodCalendar Component
- Visual calendar interface
- Mood emoji indicators
- Date selection and details
- Historical data view
- Export functionality

### MoodRecommendations Component
- Personalized activity suggestions
- Mood-based recommendations
- Progress tracking
- Multiple activity categories

## 🧠 AI Integration

### Sentiment Analysis
The platform uses advanced sentiment analysis to:
- Detect emotions from chat messages
- Suggest appropriate mood entries
- Adapt AI responses based on emotional state
- Track emotional patterns over time

### Mood Detection Algorithm
- Keyword-based emotion detection
- Confidence scoring system
- Multi-emotion recognition
- Context-aware suggestions

## 📊 Database Schema

### Core Tables
- `mood_entries`: User mood data with source tracking
- `chat_sessions`: Therapy session metadata
- `chat_messages`: Individual chat messages with sentiment
- `mood_insights`: Generated insights and patterns
- `user_preferences`: User settings and preferences

### Key Features
- Row Level Security (RLS) for data privacy
- Automatic timestamp updates
- Optimized indexes for performance
- Analytics functions for complex queries

## 🔒 Security & Privacy

- **Authentication**: Supabase Auth with RLS
- **Data Privacy**: User data isolated by authentication
- **API Security**: Protected endpoints with user validation
- **Data Encryption**: All data encrypted in transit and at rest

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
```

## 📈 Analytics & Insights

### Mood Analytics
- Average mood trends
- Mood improvement tracking
- Streak counters
- Pattern recognition
- Distribution analysis

### Chat Analytics
- Session effectiveness scoring
- Topic analysis
- Mood correlation tracking
- Response quality metrics

## 🎯 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced AI therapy techniques
- [ ] Group therapy features
- [ ] Professional therapist integration
- [ ] Advanced analytics dashboard
- [ ] Mood prediction algorithms
- [ ] Integration with wearable devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in the `/docs` folder
- Review the API documentation

## 🙏 Acknowledgments

- OpenAI for GPT integration
- Supabase for backend services
- Recharts for data visualization
- Framer Motion for animations
- Tailwind CSS for styling

---

**Built with ❤️ for mental health awareness and support**