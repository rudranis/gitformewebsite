#!/usr/bin/env python3
"""
MindGuard ML API - Flask application for mental health risk prediction
"""

import os
import pickle
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
from datetime import datetime
import joblib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Global model variable
model = None
scaler = None

def load_model():
    """Load the trained model and scaler"""
    global model, scaler
    
    try:
        # Try to load existing model
        if os.path.exists('model.pkl'):
            model = joblib.load('model.pkl')
            logger.info("✅ Loaded existing model from model.pkl")
        else:
            # Create and train a new model if none exists
            logger.info("📚 No existing model found, creating new model...")
            model = create_and_train_model()
            
        # Try to load scaler
        if os.path.exists('scaler.pkl'):
            scaler = joblib.load('scaler.pkl')
            logger.info("✅ Loaded existing scaler from scaler.pkl")
        else:
            # Create new scaler if none exists
            from sklearn.preprocessing import StandardScaler
            scaler = StandardScaler()
            # Fit with dummy data
            dummy_data = np.array([[7, 5, 5, 5, 7, 5, 5, 2, 3, 1]])
            scaler.fit(dummy_data)
            joblib.dump(scaler, 'scaler.pkl')
            logger.info("✅ Created and saved new scaler")
            
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        # Create fallback model
        model = create_fallback_model()

def create_and_train_model():
    """Create and train a new model with synthetic data"""
    from sklearn.ensemble import RandomForestClassifier
    from sklearn.preprocessing import StandardScaler
    import numpy as np
    
    # Generate synthetic training data
    np.random.seed(42)
    n_samples = 1000
    
    # Features: sleep_hours, anxiety, stress, financial_stress, social_support,
    # work_life_balance, physical_activity, substance_use, mood_changes, suicidal_thoughts
    X = []
    y = []
    
    for _ in range(n_samples):
        # Generate realistic feature combinations
        sleep_hours = np.random.normal(7, 1.5)
        sleep_hours = max(0, min(12, sleep_hours))
        
        anxiety = np.random.randint(1, 11)
        stress = np.random.randint(1, 11)
        financial_stress = np.random.randint(1, 11)
        social_support = np.random.randint(1, 11)
        work_life_balance = np.random.randint(1, 11)
        physical_activity = np.random.randint(1, 11)
        substance_use = np.random.randint(1, 11)
        mood_changes = np.random.randint(1, 11)
        suicidal_thoughts = np.random.randint(1, 11)
        
        features = [sleep_hours, anxiety, stress, financial_stress, social_support,
                   work_life_balance, physical_activity, substance_use, mood_changes, suicidal_thoughts]
        
        # Calculate risk based on features (simplified logic)
        risk_score = 0
        
        # Poor sleep increases risk
        if sleep_hours < 6:
            risk_score += 15
        elif sleep_hours < 7:
            risk_score += 8
        elif sleep_hours > 9:
            risk_score += 5
            
        # High anxiety, stress increase risk
        risk_score += (anxiety - 1) * 2
        risk_score += (stress - 1) * 2
        risk_score += (financial_stress - 1) * 1.5
        
        # Low social support increases risk
        risk_score += (10 - social_support) * 2
        risk_score += (10 - work_life_balance) * 1.5
        risk_score += (10 - physical_activity) * 1
        
        # Substance use and mood changes increase risk
        risk_score += (substance_use - 1) * 3
        risk_score += (mood_changes - 1) * 2
        risk_score += (suicidal_thoughts - 1) * 5
        
        # Determine label
        if risk_score <= 30:
            label = 0  # Low Risk
        elif risk_score <= 60:
            label = 1  # Medium Risk
        else:
            label = 2  # High Risk
            
        X.append(features)
        y.append(label)
    
    X = np.array(X)
    y = np.array(y)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save model
    joblib.dump(model, 'model.pkl')
    logger.info("✅ Created and saved new model")
    
    return model

def create_fallback_model():
    """Create a simple fallback model"""
    class FallbackModel:
        def predict_proba(self, X):
            # Simple rule-based prediction
            predictions = []
            for features in X:
                risk_score = calculate_risk_score(features)
                if risk_score <= 30:
                    predictions.append([0.8, 0.15, 0.05])  # Low risk
                elif risk_score <= 60:
                    predictions.append([0.2, 0.7, 0.1])   # Medium risk
                else:
                    predictions.append([0.1, 0.2, 0.7])   # High risk
            return np.array(predictions)
        
        def predict(self, X):
            probas = self.predict_proba(X)
            return np.argmax(probas, axis=1)
    
    logger.info("✅ Created fallback model")
    return FallbackModel()

def calculate_risk_score(features):
    """Calculate risk score from features"""
    sleep_hours, anxiety, stress, financial_stress, social_support, \
    work_life_balance, physical_activity, substance_use, mood_changes, suicidal_thoughts = features
    
    risk_score = 0
    
    # Sleep
    if sleep_hours < 6:
        risk_score += 15
    elif sleep_hours < 7:
        risk_score += 8
    elif sleep_hours > 9:
        risk_score += 5
    
    # Mental health factors
    risk_score += (anxiety - 1) * 2
    risk_score += (stress - 1) * 2
    risk_score += (financial_stress - 1) * 1.5
    risk_score += (10 - social_support) * 2
    risk_score += (10 - work_life_balance) * 1.5
    risk_score += (10 - physical_activity) * 1
    risk_score += (substance_use - 1) * 3
    risk_score += (mood_changes - 1) * 2
    risk_score += (suicidal_thoughts - 1) * 5
    
    return risk_score

@app.route('/predict', methods=['POST'])
def predict():
    """Predict mental health risk"""
    try:
        data = request.json
        features = data.get('features', [])
        
        if len(features) != 10:
            return jsonify({
                'error': 'Expected 10 features, got {}'.format(len(features))
            }), 400
        
        # Validate feature ranges
        feature_ranges = [
            (0, 12),   # sleep_hours
            (1, 10),   # anxiety_level
            (1, 10),   # stress_frequency
            (1, 10),   # financial_stress
            (1, 10),   # social_support
            (1, 10),   # work_life_balance
            (1, 10),   # physical_activity
            (1, 10),   # substance_use
            (1, 10),   # mood_changes
            (1, 10)    # suicidal_thoughts
        ]
        
        for i, (feature, (min_val, max_val)) in enumerate(zip(features, feature_ranges)):
            if not (min_val <= feature <= max_val):
                return jsonify({
                    'error': f'Feature {i} out of range. Expected {min_val}-{max_val}, got {feature}'
                }), 400
        
        # Prepare features for prediction
        features_array = np.array([features])
        
        # Scale features if scaler is available
        if scaler:
            try:
                features_array = scaler.transform(features_array)
            except Exception as e:
                logger.warning(f"Scaler transform failed: {e}")
        
        # Make prediction
        prediction_proba = model.predict_proba(features_array)[0]
        prediction_class = np.argmax(prediction_proba)
        
        # Map prediction to risk level
        risk_levels = ['Low Risk', 'Medium Risk', 'High Risk']
        risk_level = risk_levels[prediction_class]
        confidence = float(prediction_proba[prediction_class])
        
        # Generate recommendations
        recommendations = generate_recommendations(features, risk_level)
        
        result = {
            'prediction': risk_level,
            'confidence': confidence,
            'recommendations': recommendations,
            'timestamp': datetime.now().isoformat()
        }
        
        logger.info(f"Prediction made: {risk_level} (confidence: {confidence:.2f})")
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

def generate_recommendations(features, risk_level):
    """Generate personalized recommendations based on features and risk level"""
    sleep_hours, anxiety, stress, financial_stress, social_support, \
    work_life_balance, physical_activity, substance_use, mood_changes, suicidal_thoughts = features
    
    recommendations = []
    
    # Sleep recommendations
    if sleep_hours < 7:
        recommendations.append("Aim for 7-9 hours of sleep per night for better mental health")
    elif sleep_hours > 9:
        recommendations.append("Consider evaluating sleep quality - too much sleep can indicate depression")
    
    # Anxiety and stress recommendations
    if anxiety >= 7:
        recommendations.append("Practice anxiety management techniques like deep breathing or meditation")
    if stress >= 7:
        recommendations.append("Identify and address sources of stress in your life")
    
    # Social support recommendations
    if social_support <= 4:
        recommendations.append("Strengthen your social connections - reach out to friends and family")
    
    # Physical activity recommendations
    if physical_activity <= 4:
        recommendations.append("Increase physical activity - even 30 minutes of walking can improve mood")
    
    # Substance use recommendations
    if substance_use >= 6:
        recommendations.append("Consider reducing alcohol or substance use, which can worsen mental health")
    
    # Work-life balance recommendations
    if work_life_balance <= 4:
        recommendations.append("Work on improving work-life balance to reduce stress")
    
    # High-risk specific recommendations
    if risk_level == 'High Risk':
        recommendations.append("Strongly consider speaking with a mental health professional")
        if suicidal_thoughts >= 6:
            recommendations.append("If having thoughts of self-harm, contact a crisis helpline immediately")
    elif risk_level == 'Medium Risk':
        recommendations.append("Consider speaking with a counselor or therapist")
    else:
        recommendations.append("Continue maintaining healthy habits and monitor your mental health")
    
    return recommendations[:5]  # Limit to 5 recommendations

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'MindGuard ML API',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        'service': 'MindGuard ML API',
        'version': '1.0.0',
        'endpoints': {
            'predict': '/predict (POST)',
            'health': '/health (GET)'
        }
    })

if __name__ == '__main__':
    print("🤖 MindGuard ML API starting...")
    print("📚 Loading machine learning model...")
    
    load_model()
    
    if model is None:
        print("❌ Failed to load model")
        exit(1)
    
    print("✅ Model loaded successfully")
    
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting server on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)