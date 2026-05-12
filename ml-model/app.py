from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import os

from models.recommendation import RecommendationModel
from models.demand_prediction import DemandPredictionModel
from models.dynamic_pricing import DynamicPricingModel

app = Flask(__name__)
CORS(app)

# Initialize ML models
recommendation_model = RecommendationModel()
demand_model = DemandPredictionModel()
pricing_model = DynamicPricingModel()

# Load trained models if available
recommendation_model.load_model()
demand_model.load_model()


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ML API is running'}), 200


@app.route('/recommend', methods=['POST'])
def get_recommendations():
    """Get movie recommendations for a user"""
    try:
        data = request.json
        user_id = data.get('user_id')
        user_history = data.get('user_history', [])

        if not user_id:
            return jsonify({'error': 'user_id is required'}), 400

        # Get recommendations (dummy: using user history length as seed)
        # In production, would use actual collaborative filtering
        num_recommendations = 5
        # Simulated recommendations based on user history
        if user_history:
            # In real scenario, this would use collaborative filtering
            recommendations = user_history[:num_recommendations]
        else:
            # Return popular movies if no history
            recommendations = ['mov_001', 'mov_002', 'mov_003', 'mov_004', 'mov_005']

        return jsonify({
            'success': True,
            'user_id': user_id,
            'recommended_movie_ids': recommendations,
            'recommended_movies': [
                {'movie_id': m, 'score': 0.8} for m in recommendations
            ]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/predict-demand', methods=['POST'])
def predict_demand():
    """Predict demand for a show"""
    try:
        data = request.json
        movie_id = data.get('movie_id')
        show_date = data.get('show_date')
        show_time = data.get('show_time')

        if not all([movie_id, show_date, show_time]):
            return jsonify({
                'error': 'movie_id, show_date, and show_time are required'
            }), 400

        # Parse show time
        try:
            show_datetime = datetime.fromisoformat(show_date + 'T' + show_time)
        except:
            show_datetime = datetime.now()

        day_of_week = show_datetime.weekday()
        hour = show_datetime.hour
        is_weekend = day_of_week >= 5

        # Movie popularity (default: 70)
        movie_popularity = 70

        # Predict demand
        demand = demand_model.predict(day_of_week, hour, movie_popularity, is_weekend)

        return jsonify({
            'success': True,
            'movie_id': movie_id,
            'show_date': show_date,
            'show_time': show_time,
            'predicted_demand': round(demand, 2),
            'demand_level': 'High' if demand > 60 else 'Medium' if demand > 40 else 'Low',
            'confidence': 0.85
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/dynamic-price', methods=['POST'])
def calculate_dynamic_price():
    """Calculate dynamic price based on demand"""
    try:
        data = request.json
        demand = data.get('demand')
        base_price = data.get('base_price', 150)

        if demand is None:
            return jsonify({'error': 'demand is required'}), 400

        if not isinstance(demand, (int, float)) or not (0 <= demand <= 100):
            return jsonify({'error': 'demand must be between 0 and 100'}), 400

        # Calculate dynamic price
        pricing_insights = pricing_model.get_pricing_insights(demand, base_price)

        return jsonify({
            'success': True,
            'demand': demand,
            'base_price': base_price,
            'dynamic_price': pricing_insights['dynamic_price'],
            'price_change': pricing_insights['price_change'],
            'percent_change': pricing_insights['percent_change'],
            'demand_level': pricing_insights['demand_level']
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/analytics', methods=['GET'])
def get_analytics():
    """Get ML model analytics and insights"""
    return jsonify({
        'success': True,
        'models': {
            'recommendation': {
                'status': 'active',
                'algorithm': 'Collaborative Filtering',
                'trained': recommendation_model.is_trained if hasattr(recommendation_model, 'is_trained') else False
            },
            'demand_prediction': {
                'status': 'active',
                'algorithm': 'Linear Regression',
                'trained': demand_model.is_trained
            },
            'dynamic_pricing': {
                'status': 'active',
                'algorithm': 'Demand-based Pricing',
                'trained': True
            }
        }
    }), 200


@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404


@app.errorhandler(500)
def internal_error(e):
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
