#!/usr/bin/env python3
"""
Train and save the mental health risk prediction model
"""

import numpy as np
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

def generate_synthetic_data(n_samples=2000):
    """Generate synthetic mental health data"""
    np.random.seed(42)
    
    X = []
    y = []
    
    for _ in range(n_samples):
        # Generate realistic feature combinations
        sleep_hours = np.random.normal(7, 1.5)
        sleep_hours = max(0, min(12, sleep_hours))
        
        # Correlated features for more realistic data
        base_stress = np.random.uniform(1, 10)
        anxiety = np.random.normal(base_stress, 1.5)
        anxiety = max(1, min(10, anxiety))
        
        stress = np.random.normal(base_stress, 1)
        stress = max(1, min(10, stress))
        
        financial_stress = np.random.randint(1, 11)
        
        # Social support inversely correlated with stress
        social_support = np.random.normal(10 - base_stress/2, 2)
        social_support = max(1, min(10, social_support))
        
        work_life_balance = np.random.randint(1, 11)
        physical_activity = np.random.randint(1, 11)
        
        # Substance use correlated with stress
        substance_use = np.random.normal(1 + base_stress/3, 1.5)
        substance_use = max(1, min(10, substance_use))
        
        mood_changes = np.random.normal(base_stress/2, 1.5)
        mood_changes = max(1, min(10, mood_changes))
        
        # Suicidal thoughts rare but correlated with high stress/low support
        if base_stress > 8 and social_support < 4:
            suicidal_thoughts = np.random.randint(3, 8)
        else:
            suicidal_thoughts = np.random.randint(1, 4)
        
        features = [
            sleep_hours, anxiety, stress, financial_stress, social_support,
            work_life_balance, physical_activity, substance_use, mood_changes, suicidal_thoughts
        ]
        
        # Calculate risk score
        risk_score = calculate_risk_score(features)
        
        # Determine label with some noise
        noise = np.random.normal(0, 5)
        adjusted_score = risk_score + noise
        
        if adjusted_score <= 30:
            label = 0  # Low Risk
        elif adjusted_score <= 60:
            label = 1  # Medium Risk
        else:
            label = 2  # High Risk
        
        X.append(features)
        y.append(label)
    
    return np.array(X), np.array(y)

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

def train_model():
    """Train the mental health risk prediction model"""
    print("🔄 Generating synthetic training data...")
    X, y = generate_synthetic_data(2000)
    
    print(f"📊 Dataset shape: {X.shape}")
    print(f"📊 Class distribution: {np.bincount(y)}")
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale the features
    print("🔄 Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    print("🔄 Training Random Forest model...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    print("📊 Evaluating model...")
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Training accuracy: {train_score:.3f}")
    print(f"Testing accuracy: {test_score:.3f}")
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    
    # Classification report
    print("\n📊 Classification Report:")
    target_names = ['Low Risk', 'Medium Risk', 'High Risk']
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    # Feature importance
    feature_names = [
        'Sleep Hours', 'Anxiety Level', 'Stress Frequency', 'Financial Stress',
        'Social Support', 'Work-Life Balance', 'Physical Activity', 'Substance Use',
        'Mood Changes', 'Suicidal Thoughts'
    ]
    
    importance = model.feature_importances_
    feature_importance = list(zip(feature_names, importance))
    feature_importance.sort(key=lambda x: x[1], reverse=True)
    
    print("\n📊 Feature Importance:")
    for feature, imp in feature_importance:
        print(f"{feature}: {imp:.3f}")
    
    # Save the model and scaler
    print("💾 Saving model and scaler...")
    joblib.dump(model, 'model.pkl')
    joblib.dump(scaler, 'scaler.pkl')
    
    print("✅ Model training completed successfully!")
    return model, scaler

if __name__ == '__main__':
    train_model()