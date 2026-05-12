"""
Training script for ML models
Run this to train models with sample data
"""
import numpy as np
import pandas as pd
from models.recommendation import RecommendationModel
from models.demand_prediction import DemandPredictionModel

def train_recommendation_model():
    """Train the recommendation model with sample data"""
    print("Training Recommendation Model...")

    # Create sample user-movie interaction data
    np.random.seed(42)
    n_users = 100
    n_movies = 50

    data = {
        'user_id': np.repeat(np.arange(1, n_users + 1), 10),
        'movie_id': np.tile(np.arange(1, n_movies + 1), n_users)[:n_users * 10],
        'rating': np.random.randint(1, 6, size=n_users * 10)
    }

    df = pd.DataFrame(data)

    # Train model
    model = RecommendationModel()
    model.train(df)

    print("✓ Recommendation model trained and saved!")


def train_demand_prediction_model():
    """Train the demand prediction model with sample data"""
    print("Training Demand Prediction Model...")

    # Create sample training data
    np.random.seed(42)
    n_samples = 1000

    # Features: [day_of_week, hour, movie_popularity, weekend_factor]
    X = np.random.rand(n_samples, 4) * [7, 24, 100, 2]
    X[:, 0] = X[:, 0].astype(int)  # Day of week (0-6)
    X[:, 1] = X[:, 1].astype(int)  # Hour (0-23)
    X[:, 3] = np.where(X[:, 0] >= 5, 1.3, 1.0)  # Weekend factor

    # Target: demand percentage (0-100)
    y = X[:, 2] * 0.7 + X[:, 1] * 2 - 20 + np.random.randn(n_samples) * 10
    y = np.clip(y, 0, 100)

    # Train model
    model = DemandPredictionModel()
    model.train(X, y)

    print("✓ Demand prediction model trained and saved!")


if __name__ == '__main__':
    print("Starting ML Model Training...\n")
    train_recommendation_model()
    train_demand_prediction_model()
    print("\n✓ All models trained successfully!")
