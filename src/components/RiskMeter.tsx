import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface RiskMeterProps {
  riskLevel: 'Low Risk' | 'Medium Risk' | 'High Risk' | null;
  confidence?: number;
}

const RiskMeter: React.FC<RiskMeterProps> = ({ riskLevel, confidence }) => {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'Low Risk':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-300',
          icon: CheckCircle,
          percentage: 25,
          description: 'Your mental health indicators suggest low risk. Keep maintaining healthy habits!'
        };
      case 'Medium Risk':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-300',
          icon: AlertCircle,
          percentage: 60,
          description: 'Some indicators suggest moderate concern. Consider speaking with a mental health professional.'
        };
      case 'High Risk':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-300',
          icon: AlertTriangle,
          percentage: 90,
          description: 'Several indicators suggest higher risk. We strongly recommend seeking professional support.'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          borderColor: 'border-gray-300',
          icon: AlertCircle,
          percentage: 0,
          description: 'Complete the assessment to see your mental health risk level.'
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`p-6 rounded-xl border-2 ${config.borderColor} ${config.bgColor}`}>
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32">
            {/* Background circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200"
              />
              {riskLevel && (
                <motion.circle
                  cx="60"
                  cy="60"
                  r="50"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className={config.color}
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 50 * (1 - config.percentage / 100)
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              )}
            </svg>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className={`h-8 w-8 ${config.color}`} />
            </div>
          </div>
        </div>

        <h3 className={`text-2xl font-bold ${config.color} mb-2`}>
          {riskLevel || 'Not Assessed'}
        </h3>
        
        {confidence && (
          <p className="text-sm text-gray-600 mb-3">
            Confidence: {Math.round(confidence * 100)}%
          </p>
        )}
        
        <p className="text-sm text-gray-700 leading-relaxed">
          {config.description}
        </p>
      </div>
    </div>
  );
};

export default RiskMeter;