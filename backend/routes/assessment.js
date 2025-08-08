const express = require('express');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const Submission = require('../models/Submission');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// ML API endpoint
const ML_API_URL = process.env.ML_API_URL || 'http://localhost:5000';

// Validation rules for assessment form
const assessmentValidation = [
  body('sleepHours').isInt({ min: 0, max: 12 }).withMessage('Sleep hours must be between 0 and 12'),
  body('anxietyLevel').isInt({ min: 1, max: 10 }).withMessage('Anxiety level must be between 1 and 10'),
  body('stressFrequency').isInt({ min: 1, max: 10 }).withMessage('Stress frequency must be between 1 and 10'),
  body('financialStress').isInt({ min: 1, max: 10 }).withMessage('Financial stress must be between 1 and 10'),
  body('socialSupport').isInt({ min: 1, max: 10 }).withMessage('Social support must be between 1 and 10'),
  body('workLifeBalance').isInt({ min: 1, max: 10 }).withMessage('Work-life balance must be between 1 and 10'),
  body('physicalActivity').isInt({ min: 1, max: 10 }).withMessage('Physical activity must be between 1 and 10'),
  body('substanceUse').isInt({ min: 1, max: 10 }).withMessage('Substance use must be between 1 and 10'),
  body('moodChanges').isInt({ min: 1, max: 10 }).withMessage('Mood changes must be between 1 and 10'),
  body('suicidalThoughts').isInt({ min: 1, max: 10 }).withMessage('Suicidal thoughts must be between 1 and 10')
];

// Submit assessment endpoint
router.post('/submit', authMiddleware, assessmentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const formData = req.body;
    const userId = req.user._id;

    // Call ML API for prediction
    let prediction;
    try {
      const mlResponse = await axios.post(`${ML_API_URL}/predict`, {
        features: [
          formData.sleepHours,
          formData.anxietyLevel,
          formData.stressFrequency,
          formData.financialStress,
          formData.socialSupport,
          formData.workLifeBalance,
          formData.physicalActivity,
          formData.substanceUse,
          formData.moodChanges,
          formData.suicidalThoughts
        ]
      }, {
        timeout: 10000
      });

      prediction = mlResponse.data;
    } catch (mlError) {
      console.error('ML API error:', mlError.message);
      
      // Fallback prediction logic
      prediction = generateFallbackPrediction(formData);
    }

    // Save submission to database
    const submission = new Submission({
      userId,
      formData,
      prediction,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await submission.save();

    // Update user assessment count
    await User.findByIdAndUpdate(userId, {
      $inc: { assessmentCount: 1 }
    });

    res.json({
      success: true,
      message: 'Assessment completed successfully',
      data: prediction
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during assessment submission'
    });
  }
});

// Get assessment history endpoint
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-ipAddress -userAgent');

    const total = await Submission.countDocuments({ userId });

    res.json({
      success: true,
      data: submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Assessment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching assessment history'
    });
  }
});

// Fallback prediction function
function generateFallbackPrediction(formData) {
  const {
    sleepHours,
    anxietyLevel,
    stressFrequency,
    financialStress,
    socialSupport,
    workLifeBalance,
    physicalActivity,
    substanceUse,
    moodChanges,
    suicidalThoughts
  } = formData;

  // Calculate risk score (0-100)
  let riskScore = 0;

  // Sleep (poor sleep increases risk)
  if (sleepHours < 6) riskScore += 15;
  else if (sleepHours < 7) riskScore += 8;
  else if (sleepHours > 9) riskScore += 5;

  // High anxiety, stress, financial stress increase risk
  riskScore += (anxietyLevel - 1) * 2;
  riskScore += (stressFrequency - 1) * 2;
  riskScore += (financialStress - 1) * 1.5;

  // Low social support increases risk
  riskScore += (10 - socialSupport) * 2;

  // Poor work-life balance increases risk
  riskScore += (10 - workLifeBalance) * 1.5;

  // Low physical activity increases risk
  riskScore += (10 - physicalActivity) * 1;

  // Substance use increases risk
  riskScore += (substanceUse - 1) * 3;

  // Mood changes increase risk
  riskScore += (moodChanges - 1) * 2;

  // Suicidal thoughts significantly increase risk
  riskScore += (suicidalThoughts - 1) * 5;

  // Determine risk level
  let prediction, confidence;
  let recommendations = [];

  if (riskScore <= 30) {
    prediction = 'Low Risk';
    confidence = 0.85;
    recommendations = [
      'Continue maintaining healthy habits',
      'Regular exercise and good sleep schedule',
      'Stay connected with friends and family',
      'Practice stress management techniques'
    ];
  } else if (riskScore <= 60) {
    prediction = 'Medium Risk';
    confidence = 0.78;
    recommendations = [
      'Consider speaking with a mental health professional',
      'Focus on improving sleep quality and duration',
      'Increase physical activity and social connections',
      'Practice mindfulness and stress reduction techniques',
      'Limit alcohol and substance use'
    ];
  } else {
    prediction = 'High Risk';
    confidence = 0.82;
    recommendations = [
      'Strongly recommend seeking professional mental health support',
      'Contact a crisis helpline if experiencing suicidal thoughts',
      'Reach out to trusted friends, family, or support groups',
      'Consider medication evaluation with a psychiatrist',
      'Develop a safety plan with a mental health professional'
    ];
  }

  return {
    prediction,
    confidence,
    recommendations,
    timestamp: new Date().toISOString()
  };
}

module.exports = router;