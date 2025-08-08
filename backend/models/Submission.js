const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  formData: {
    sleepHours: {
      type: Number,
      required: true,
      min: 0,
      max: 12
    },
    anxietyLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    stressFrequency: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    financialStress: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    socialSupport: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    workLifeBalance: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    physicalActivity: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    substanceUse: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    moodChanges: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    suicidalThoughts: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    }
  },
  prediction: {
    prediction: {
      type: String,
      enum: ['Low Risk', 'Medium Risk', 'High Risk'],
      required: true
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1
    },
    recommendations: [{
      type: String
    }],
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
submissionSchema.index({ userId: 1, createdAt: -1 });
submissionSchema.index({ 'prediction.prediction': 1 });

module.exports = mongoose.model('Submission', submissionSchema);