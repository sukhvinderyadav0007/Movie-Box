import numpy as np
from sklearn.linear_model import LinearRegression
import joblib
import os
from datetime import datetime

class DemandPredictionModel:
    """Demand Prediction using Linear Regression"""

    def __init__(self):
        self.model = LinearRegression()
        self.is_trained = False
        self.model_path = 'models/demand_prediction_model.pkl'
        self.feature_names = ['day_of_week', 'hour', 'movie_popularity', 'weekend_factor']

    def train(self, X, y):
        """
        Train demand prediction model
        Args:
            X: Features [day_of_week, hour, movie_popularity, weekend_factor]
            y: Target values (demand/occupancy percentage)
        """
        self.model.fit(X, y)
        self.is_trained = True
        self.save_model()

    def predict(self, day_of_week, hour, movie_popularity, is_weekend=False):
        """
        Predict demand for a show
        Args:
            day_of_week: 0-6 (Monday-Sunday)
            hour: 0-23
            movie_popularity: 0-100
            is_weekend: Boolean
        Returns:
            Predicted demand percentage (0-100)
        """
        if not self.is_trained:
            # Return default prediction based on heuristics
            return self._heuristic_prediction(
                day_of_week, hour, movie_popularity, is_weekend
            )

        weekend_factor = 1.2 if is_weekend else 1.0
        features = np.array([[day_of_week, hour, movie_popularity, weekend_factor]])

        prediction = self.model.predict(features)[0]
        # Clamp between 0 and 100
        return max(0, min(100, prediction))

    def _heuristic_prediction(self, day_of_week, hour, movie_popularity, is_weekend):
        """Fallback heuristic prediction"""
        base_demand = movie_popularity * 0.8

        # Time of day factor
        if 10 <= hour <= 12:
            time_factor = 0.6  # Morning shows less popular
        elif 15 <= hour <= 18:
            time_factor = 0.9  # Evening shows popular
        elif 19 <= hour <= 22:
            time_factor = 1.2  # Night shows most popular
        else:
            time_factor = 0.5

        # Weekend factor
        weekend_factor = 1.3 if is_weekend else 1.0

        demand = base_demand * time_factor * weekend_factor
        return max(0, min(100, demand))

    def save_model(self):
        """Save model to disk"""
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.model, self.model_path)

    def load_model(self):
        """Load model from disk"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
            self.is_trained = True
