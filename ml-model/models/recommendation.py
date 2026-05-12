import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import os

class RecommendationModel:
    """Movie Recommendation using Collaborative Filtering"""

    def __init__(self):
        self.user_item_matrix = None
        self.similarity_matrix = None
        self.model_path = 'models/recommendation_model.pkl'

    def train(self, user_movie_data):
        """
        Train the recommendation model using user-movie interactions
        Args:
            user_movie_data: DataFrame with columns [user_id, movie_id, rating]
        """
        # Create user-item matrix
        self.user_item_matrix = user_movie_data.pivot_table(
            index='user_id',
            columns='movie_id',
            values='rating',
            fill_value=0
        )

        # Calculate cosine similarity between users
        self.similarity_matrix = cosine_similarity(self.user_item_matrix)

        # Save model
        self.save_model()

    def predict(self, user_id, n_recommendations=5):
        """
        Predict top N recommendations for a user
        Args:
            user_id: User ID
            n_recommendations: Number of recommendations to return
        Returns:
            List of recommended movie IDs
        """
        if self.similarity_matrix is None:
            return self._get_popular_movies(n_recommendations)

        try:
            user_idx = self.user_item_matrix.index.tolist().index(user_id)
        except ValueError:
            # User not in training data, return popular movies
            return self._get_popular_movies(n_recommendations)

        # Get similar users
        similar_users = np.argsort(self.similarity_matrix[user_idx])[::-1][1:]

        # Get movies rated by similar users but not by current user
        user_movies = set(
            self.user_item_matrix.columns[
                self.user_item_matrix.iloc[user_idx] > 0
            ]
        )
        recommendations = []

        for similar_user_idx in similar_users:
            similar_user_movies = set(
                self.user_item_matrix.columns[
                    self.user_item_matrix.iloc[similar_user_idx] > 0
                ]
            )
            new_movies = similar_user_movies - user_movies
            recommendations.extend(new_movies)

            if len(recommendations) >= n_recommendations:
                break

        return recommendations[:n_recommendations]

    def _get_popular_movies(self, n):
        """Get popular movies as fallback"""
        if self.user_item_matrix is None:
            return []
        # Return movies with highest average ratings
        avg_ratings = self.user_item_matrix.mean()
        return avg_ratings.nlargest(n).index.tolist()

    def save_model(self):
        """Save model to disk"""
        os.makedirs('models', exist_ok=True)
        joblib.dump(
            {
                'user_item_matrix': self.user_item_matrix,
                'similarity_matrix': self.similarity_matrix,
            },
            self.model_path
        )

    def load_model(self):
        """Load model from disk"""
        if os.path.exists(self.model_path):
            data = joblib.load(self.model_path)
            self.user_item_matrix = data['user_item_matrix']
            self.similarity_matrix = data['similarity_matrix']
