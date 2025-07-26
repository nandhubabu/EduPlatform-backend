const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');

// POST /api/chatbot/message - Handle chatbot conversations
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    // Generate response using Gemini AI
    const aiResponse = await geminiService.generateResponse(message, conversationHistory);

    res.json({
      success: true,
      data: {
        response: aiResponse.text,
        quickReplies: aiResponse.quickReplies,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message',
      data: {
        response: "I'm experiencing some technical difficulties. Please try again in a moment, or feel free to browse our career assessment and courses while I get back online!",
        quickReplies: [
          { text: "Career Assessment", action: "assessment" },
          { text: "Browse Courses", action: "courses" },
          { text: "Try Again", action: "retry" }
        ]
      }
    });
  }
});

// POST /api/chatbot/career-advice - Get personalized career advice
router.post('/career-advice', async (req, res) => {
  try {
    const { interests, experience, goals } = req.body;

    if (!interests || !goals) {
      return res.status(400).json({
        success: false,
        error: 'Interests and goals are required'
      });
    }

    const advice = await geminiService.getCareerAdvice(interests, experience, goals);

    res.json({
      success: true,
      data: {
        advice,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Career advice API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate career advice'
    });
  }
});

// POST /api/chatbot/course-recommendations - Get course recommendations
router.post('/course-recommendations', async (req, res) => {
  try {
    const { careerGoal, currentSkills } = req.body;

    if (!careerGoal) {
      return res.status(400).json({
        success: false,
        error: 'Career goal is required'
      });
    }

    const recommendations = await geminiService.getCourseRecommendations(careerGoal, currentSkills || 'Beginner');

    res.json({
      success: true,
      data: {
        recommendations,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Course recommendations API Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate course recommendations'
    });
  }
});

// GET /api/chatbot/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Chatbot API is running',
    geminiStatus: 'connected',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
