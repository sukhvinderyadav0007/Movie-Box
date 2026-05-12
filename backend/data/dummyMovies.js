const movies = [
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker emerges...',
    genre: ['Action', 'Drama'], // ❌ Crime hata diya
    duration: 152,
    releaseDate: new Date('2024-01-15'),
    posterUrl: "https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg",
    language: 'English',
    status: 'now-showing',
    popularity: 95,
    rating: 9
  },
  {
    title: 'Inception',
    description: 'Dream-sharing technology...',
    genre: ['Action', 'Sci-Fi', 'Thriller'],
    duration: 148,
    releaseDate: new Date('2024-02-01'),
    posterUrl: "https://image.tmdb.org/t/p/w500/qmDpIHrmpJINaRKAfWQfftjCdyi.jpg",
    language: 'English',
    status: 'now-showing',
    popularity: 92,
    rating: 8.8
  },
  {
    title: 'Interstellar',
    description: 'Space exploration...',
    genre: ['Drama', 'Sci-Fi'], // ❌ Adventure hata diya
    duration: 169,
    releaseDate: new Date('2024-03-10'),
    posterUrl: "https://image.tmdb.org/t/p/w500/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",
    language: 'English',
    status: 'now-showing',
    popularity: 88,
    rating: 8.6
  },
  {
    title: 'Titanic',
    description: 'Love story on Titanic...',
    genre: ['Drama', 'Romance'],
    duration: 194,
    releaseDate: new Date('2024-04-05'),
    posterUrl: "https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    language: 'English',
    status: 'now-showing',
    popularity: 85,
    rating: 8
  },
  {
    title: 'Avatar',
    description: 'Pandora mission...',
    genre: ['Action', 'Sci-Fi'], // ❌ Adventure hata diya
    duration: 162,
    releaseDate: new Date('2024-05-12'),
    posterUrl: "https://image.tmdb.org/t/p/w500/8kOWDBK6XlPUzckuHDo3wwVRFwt.jpg",
    language: 'English',
    status: 'now-showing',
    popularity: 90,
    rating: 8.2
  }
];

module.exports = { movies };