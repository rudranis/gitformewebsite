import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Loader2 } from 'lucide-react';
import { MentalHealthForm } from '../types';

interface AssessmentFormProps {
  onSubmit: (data: MentalHealthForm) => Promise<void>;
  isLoading: boolean;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<MentalHealthForm>({
    sleepHours: 7,
    anxietyLevel: 3,
    stressFrequency: 3,
    financialStress: 3,
    socialSupport: 7,
    workLifeBalance: 5,
    physicalActivity: 5,
    substanceUse: 1,
    moodChanges: 3,
    suicidalThoughts: 1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleSliderChange = (field: keyof MentalHealthForm, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const questions = [
    {
      key: 'sleepHours' as keyof MentalHealthForm,
      label: 'How many hours do you sleep per night on average?',
      min: 0,
      max: 12,
      unit: 'hours',
      lowLabel: 'Very little',
      highLabel: 'Plenty'
    },
    {
      key: 'anxietyLevel' as keyof MentalHealthForm,
      label: 'How often do you feel anxious or worried?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Never',
      highLabel: 'Always'
    },
    {
      key: 'stressFrequency' as keyof MentalHealthForm,
      label: 'How frequently do you experience stress?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Rarely',
      highLabel: 'Constantly'
    },
    {
      key: 'financialStress' as keyof MentalHealthForm,
      label: 'How much financial stress do you experience?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'None',
      highLabel: 'Severe'
    },
    {
      key: 'socialSupport' as keyof MentalHealthForm,
      label: 'How strong is your social support system?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Very weak',
      highLabel: 'Very strong'
    },
    {
      key: 'workLifeBalance' as keyof MentalHealthForm,
      label: 'How would you rate your work-life balance?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Very poor',
      highLabel: 'Excellent'
    },
    {
      key: 'physicalActivity' as keyof MentalHealthForm,
      label: 'How often do you engage in physical activity?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Never',
      highLabel: 'Daily'
    },
    {
      key: 'substanceUse' as keyof MentalHealthForm,
      label: 'How often do you use alcohol or substances to cope?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Never',
      highLabel: 'Very often'
    },
    {
      key: 'moodChanges' as keyof MentalHealthForm,
      label: 'How often do you experience sudden mood changes?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Never',
      highLabel: 'Very often'
    },
    {
      key: 'suicidalThoughts' as keyof MentalHealthForm,
      label: 'Have you had thoughts of self-harm or suicide?',
      min: 1,
      max: 10,
      unit: '',
      lowLabel: 'Never',
      highLabel: 'Frequently'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center mb-6">
        <Brain className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Mental Health Assessment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {questions.map((question, index) => (
          <motion.div
            key={question.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <label className="block text-sm font-medium text-gray-700">
              {question.label}
            </label>
            
            <div className="px-4">
              <input
                type="range"
                min={question.min}
                max={question.max}
                value={formData[question.key]}
                onChange={(e) => handleSliderChange(question.key, parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                    ((formData[question.key] - question.min) / (question.max - question.min)) * 100
                  }%, #e5e7eb ${
                    ((formData[question.key] - question.min) / (question.max - question.min)) * 100
                  }%, #e5e7eb 100%)`
                }}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">{question.lowLabel}</span>
                <span className="text-sm font-medium text-blue-600">
                  {formData[question.key]}{question.unit}
                </span>
                <span className="text-xs text-gray-500">{question.highLabel}</span>
              </div>
            </div>
          </motion.div>
        ))}

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            'Analyze Mental Health Risk'
          )}
        </motion.button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Privacy Notice:</strong> Your responses are confidential and used only for risk assessment. 
          If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.
        </p>
      </div>
    </motion.div>
  );
};

export default AssessmentForm;