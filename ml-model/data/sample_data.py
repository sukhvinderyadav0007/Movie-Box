"""
Sample data generation for testing
"""
import json
from datetime import datetime, timedelta

def generate_sample_bookings():
    """Generate sample booking data"""
    bookings = [
        {
            "movie_id": "mov_001",
            "user_id": "user_1",
            "show_date": "2024-05-01",
            "show_time": "18:00",
            "seats": 2,
            "price": 150
        },
        {
            "movie_id": "mov_002",
            "user_id": "user_2",
            "show_date": "2024-05-01",
            "show_time": "20:00",
            "seats": 4,
            "price": 150
        },
        {
            "movie_id": "mov_001",
            "user_id": "user_3",
            "show_date": "2024-05-02",
            "show_time": "19:00",
            "seats": 3,
            "price": 150
        },
    ]
    return bookings


def generate_sample_movies():
    """Generate sample movie data"""
    movies = [
        {
            "movie_id": "mov_001",
            "title": "The Dark Knight",
            "popularity": 95,
            "genre": ["Action", "Crime"],
            "duration": 152
        },
        {
            "movie_id": "mov_002",
            "title": "Inception",
            "popularity": 92,
            "genre": ["Action", "Sci-Fi"],
            "duration": 148
        },
        {
            "movie_id": "mov_003",
            "title": "Interstellar",
            "popularity": 88,
            "genre": ["Adventure", "Sci-Fi"],
            "duration": 169
        },
    ]
    return movies


if __name__ == '__main__':
    print("Sample Bookings:")
    print(json.dumps(generate_sample_bookings(), indent=2))
    print("\nSample Movies:")
    print(json.dumps(generate_sample_movies(), indent=2))
