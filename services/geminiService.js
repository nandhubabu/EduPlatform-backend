const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Career and education context for better responses
    this.systemContext = `
You are a professional Career Guidance AI Assistant for a career development and education platform. Your role is to:

1. CAREER GUIDANCE:
- Help users discover careers that match their interests and skills
- Provide information about job markets, salary ranges, and growth prospects
- Guide users through career transitions and planning
- Explain different career paths and requirements

2. EDUCATION & SKILLS:
- Recommend relevant courses and learning paths
- Explain skill requirements for different careers
- Provide study tips and learning strategies
- Guide certification and professional development

3. PLATFORM ASSISTANCE:
- Help users navigate the platform features
- Explain the O*NET career assessment (RIASEC model)
- Provide technical support and troubleshooting
- Answer questions about courses and content

4. PROBLEM SOLVING:
- Address career confusion and decision paralysis
- Help with skill gap analysis
- Provide actionable steps for career goals
- Offer motivational and practical advice

RESPONSE GUIDELINES:
- Be encouraging, professional, and supportive
- Provide specific, actionable advice
- Use relevant emojis to make responses engaging
- Keep responses concise but comprehensive
- Always offer next steps or follow-up questions
- When discussing careers, mention our career assessment
- For learning needs, suggest relevant courses
- Be empathetic to career challenges and uncertainties

PLATFORM CONTEXT:
- We have an O*NET-based career assessment with 60 questions
- Courses available in: Web Development, Data Science, Digital Marketing, Design, Business, etc.
- We provide certification guidance with real links and costs
- The platform serves students, career changers, and professionals

Respond naturally and conversationally while maintaining professionalism.
`;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context
      let prompt = this.systemContext + "\n\nConversation History:\n";
      
      // Add recent conversation history (last 5 messages)
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        prompt += `${msg.isBot ? 'Assistant' : 'User'}: ${msg.text}\n`;
      });
      
      prompt += `\nUser: ${userMessage}\n\nAssistant:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Analyze response to suggest quick replies
      const quickReplies = this.generateQuickReplies(userMessage, text);

      return {
        text: text.trim(),
        quickReplies: quickReplies
      };
    } catch (error) {
      console.error('Gemini AI Error:', error);
      return this.getFallbackResponse(userMessage);
    }
  }

  generateQuickReplies(userMessage, aiResponse) {
    const message = userMessage.toLowerCase();
    const response = aiResponse.toLowerCase();

    // Career-related quick replies
    if (message.includes('career') || response.includes('career')) {
      return [
        { text: "Take Career Assessment", action: "assessment" },
        { text: "Browse Career Paths", action: "career_paths" },
        { text: "Skills Development", action: "skills" }
      ];
    }

    // Course-related quick replies
    if (message.includes('course') || message.includes('learn') || response.includes('course')) {
      return [
        { text: "Browse Courses", action: "courses" },
        { text: "Recommend for Me", action: "personalized_courses" },
        { text: "Free Resources", action: "free_courses" }
      ];
    }

    // Problem-solving quick replies
    if (message.includes('help') || message.includes('stuck') || message.includes('confused')) {
      return [
        { text: "Career Guidance", action: "career_guidance" },
        { text: "Skill Assessment", action: "skill_assessment" },
        { text: "Learning Path", action: "learning_path" }
      ];
    }

    // Assessment-related quick replies
    if (message.includes('assessment') || message.includes('test') || response.includes('assessment')) {
      return [
        { text: "Start Assessment", action: "redirect_assessment" },
        { text: "How it Works", action: "assessment_info" },
        { text: "Career Types", action: "career_types" }
      ];
    }

    // Default quick replies
    return [
      { text: "Career Assessment", action: "assessment" },
      { text: "Browse Courses", action: "courses" },
      { text: "Get Help", action: "help" },
      { text: "Platform Info", action: "about" }
    ];
  }

  getFallbackResponse(userMessage) {
    return {
      text: "I'm here to help you with career guidance and learning! While I process your request, I can assist you with career assessments, course recommendations, skill development, and platform navigation. What specific area would you like to explore?",
      quickReplies: [
        { text: "Career Assessment", action: "assessment" },
        { text: "Course Recommendations", action: "courses" },
        { text: "Skill Development", action: "skills" },
        { text: "Platform Help", action: "about" }
      ]
    };
  }

  // Enhanced career-specific prompts
  async getCareerAdvice(interests, experience, goals) {
    const prompt = `
    ${this.systemContext}
    
    User Profile:
    - Interests: ${interests}
    - Experience Level: ${experience}
    - Career Goals: ${goals}
    
    Please provide personalized career advice including:
    1. Recommended career paths
    2. Skills to develop
    3. Learning resources
    4. Next steps
    
    Keep the response encouraging and actionable.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Career advice error:', error);
      return "I'd be happy to help with career advice! Consider taking our career assessment to get personalized recommendations based on your interests and goals.";
    }
  }

  // Course recommendation based on career goals
  async getCourseRecommendations(careerGoal, currentSkills) {
    const prompt = `
    ${this.systemContext}
    
    User wants to pursue: ${careerGoal}
    Current skills: ${currentSkills}
    
    Available course categories on our platform:
    - Web Development (React, Node.js, Python, JavaScript)
    - Data Science (Python, SQL, Machine Learning, Analytics)
    - Digital Marketing (SEO, Social Media, Content Marketing)
    - Design (UI/UX, Graphic Design, Adobe Creative Suite)
    - Business (Project Management, Entrepreneurship, Leadership)
    - Cloud Computing (AWS, Azure, DevOps)
    
    Recommend specific courses and learning path to achieve their career goal.
    Include skill progression and timeline suggestions.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Course recommendation error:', error);
      return "I can help you find the right courses! Browse our course catalog or take the career assessment to get personalized learning path recommendations.";
    }
  }
}

module.exports = new GeminiService();
