import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, User, History, Brain, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { assessmentApi } from '../services/api';
import { RiskAssessment, Submission, MentalHealthForm } from '../types';
import RiskMeter from '../components/RiskMeter';
import AssessmentForm from '../components/AssessmentForm';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentAssessment, setCurrentAssessment] = useState<RiskAssessment | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadAssessmentHistory();
  }, []);

  const loadAssessmentHistory = async () => {
    try {
      const response = await assessmentApi.getHistory();
      if (response.success && response.data) {
        setAssessmentHistory(response.data);
        if (response.data.length > 0) {
          setCurrentAssessment(response.data[0].prediction);
        }
      }
    } catch (error) {
      console.error('Failed to load assessment history:', error);
    }
  };

  const handleAssessmentSubmit = async (formData: MentalHealthForm) => {
    setIsLoading(true);
    try {
      const response = await assessmentApi.submitForm(formData);
      if (response.success && response.data) {
        setCurrentAssessment(response.data);
        await loadAssessmentHistory();
      } else {
        throw new Error(response.error || 'Assessment failed');
      }
    } catch (error) {
      console.error('Assessment failed:', error);
      alert('Assessment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskTrend = () => {
    if (assessmentHistory.length < 2) return null;
    
    const latest = assessmentHistory[0];
    const previous = assessmentHistory[1];
    
    const riskLevels = { 'Low Risk': 1, 'Medium Risk': 2, 'High Risk': 3 };
    const latestLevel = riskLevels[latest.prediction.prediction];
    const previousLevel = riskLevels[previous.prediction.prediction];
    
    if (latestLevel < previousLevel) return 'improving';
    if (latestLevel > previousLevel) return 'worsening';
    return 'stable';
  };

  const trend = getRiskTrend();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg mr-3">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MindGuard</h1>
                <p className="text-sm text-gray-500">Mental Health Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <History className="h-4 w-4 mr-2" />
                History
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Risk Meter */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <RiskMeter 
                riskLevel={currentAssessment?.prediction || null}
                confidence={currentAssessment?.confidence}
              />
              
              {/* Trend Indicator */}
              {trend && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg border-2 ${
                    trend === 'improving' 
                      ? 'bg-green-50 border-green-200' 
                      : trend === 'worsening'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center">
                    <TrendingUp className={`h-5 w-5 mr-2 ${
                      trend === 'improving' 
                        ? 'text-green-600 transform rotate-180' 
                        : trend === 'worsening'
                        ? 'text-red-600'
                        : 'text-blue-600'
                    }`} />
                    <span className={`text-sm font-medium ${
                      trend === 'improving' 
                        ? 'text-green-800' 
                        : trend === 'worsening'
                        ? 'text-red-800'
                        : 'text-blue-800'
                    }`}>
                      {trend === 'improving' && 'Risk level improving'}
                      {trend === 'worsening' && 'Risk level increasing'}
                      {trend === 'stable' && 'Risk level stable'}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Recommendations */}
              {currentAssessment?.recommendations && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
                  <ul className="space-y-2">
                    {currentAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Assessment Form */}
          <div className="lg:col-span-2">
            {!showHistory ? (
              <AssessmentForm 
                onSubmit={handleAssessmentSubmit}
                isLoading={isLoading}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Assessment History</h2>
                
                {assessmentHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No assessments yet. Take your first assessment to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {assessmentHistory.map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                              submission.prediction.prediction === 'Low Risk'
                                ? 'bg-green-100 text-green-800'
                                : submission.prediction.prediction === 'Medium Risk'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {submission.prediction.prediction}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(submission.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600">
                          <p>Confidence: {Math.round(submission.prediction.confidence * 100)}%</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Crisis Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-red-800 mb-3">Crisis Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-medium text-red-700">National Suicide Prevention Lifeline</p>
              <p className="text-red-600">988 or 1-800-273-8255</p>
            </div>
            <div>
              <p className="font-medium text-red-700">Crisis Text Line</p>
              <p className="text-red-600">Text HOME to 741741</p>
            </div>
            <div>
              <p className="font-medium text-red-700">Emergency Services</p>
              <p className="text-red-600">911</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;