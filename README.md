# RecomendAI

RecomendAI is an AI Entertainment Picker is a web application that helps users discover new movies, TV shows, animes, music, activities based on their preferences in that day.

## Features

- The app must be in Portuguese-Brazil
- User login and registration (Google and email/password)
- Activity selection
  - Watch a movie
  - Watch a TV show
  - Watch an anime
  - Listen to music
  - Do an activity (Soon to be added)
  - Randomly select one of the above activities

- If movie, TV show, or anime is selected:
  - User can select a genre (optional)
  - User can select a release year range (optional)
  - User can select a rating range (optional)
  - User can select a number of seasons range (for TV shows) (optional)
  - User can select a number of episodes range (for TV shows and animes) (optional)

- If music is selected:
  - User can select a genre (optional)
  - User can select a release year range (optional)
  - User can select language (optional)

- If activity is selected (Soon to be added):
  - User can select a category (e.g. going out, cooking, etc.) (optional)
  - User can select indoor or outdoor (optional)
  - User can select a price range (optional)

- Allow users to create a shared room where they can invite friends to join and get recommendations together. The system will take into account the preferences of all users in the room to generate recommendations that suit everyone.

- System get all the inputs and generate a propmt to send to the AI model to get a recommendation. The system will also send the prviously generated recommendations to the AI model to avoid recommending the same thing again.

- System saves recommendations to the user's history.
- User can view their history of recommendations.
- User can view details of each recommendation (e.g. for movies, TV shows, and animes: title, genre, release year, rating, number of seasons, number of episodes; for music: title, artist, genre, release year, language; for activities: title, category, indoor/outdoor, price range).

## Technologies Used

- Next.js 16
- Tailwind CSS
- Gemini API for AI recommendations
- IMDb API for movie, TV show, and anime details
