# Food Service - MoodBites

A RESTful API service for managing food recipes with Supabase integration.

## Features

- ✅ CRUD operations for dishes
- ✅ Mood-based recipe filtering
- ✅ User-specific recipe management
- ✅ Search functionality
- ✅ Ingredient-based recipe discovery
- ✅ Supabase integration

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=5001
NODE_ENV=development
```

### 3. Supabase Database Setup
Create a `dishes` table in your Supabase database:

```sql
CREATE TABLE dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  mood text NOT NULL,
  cook_time text,
  servings integer,
  difficulty text,
  description text,
  ingredients text[] DEFAULT '{}',
  instructions text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  image_url text,
  user_id text, -- This stores MongoDB _id
  created_at timestamptz DEFAULT now()
);
```

### 4. Run the Service
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Dishes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food/dishes` | Get all dishes with optional filters |
| GET | `/api/food/dishes/:id` | Get dish by ID |
| POST | `/api/food/dishes` | Create new dish |
| PUT | `/api/food/dishes/:id` | Update dish |
| DELETE | `/api/food/dishes/:id` | Delete dish |

### Filtering & Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food/dishes?mood=happy` | Filter by mood |
| GET | `/api/food/dishes?difficulty=easy` | Filter by difficulty |
| GET | `/api/food/dishes?search=pasta` | Search in title/description |
| GET | `/api/food/search?q=chicken` | Search dishes |
| GET | `/api/food/moods/:mood/dishes` | Get dishes by mood |
| POST | `/api/food/dishes/by-ingredients` | Get dishes by ingredients |

### User Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/food/users/:userId/dishes` | Get dishes by user |

## Request Examples

### Create Dish
```json
POST /api/food/dishes
{
  "title": "Chicken Pasta",
  "mood": "happy",
  "cook_time": "30 minutes",
  "servings": 4,
  "difficulty": "easy",
  "description": "A delicious chicken pasta recipe",
  "ingredients": ["chicken", "pasta", "tomatoes"],
  "instructions": ["Cook pasta", "Fry chicken", "Combine"],
  "tags": ["pasta", "chicken", "italian"],
  "image_url": "https://example.com/image.jpg",
  "user_id": "user123"
}
```

### Filter Dishes
```
GET /api/food/dishes?mood=happy&difficulty=easy&search=pasta
```

### Search Dishes
```
GET /api/food/search?q=chicken
```

### Get Dishes by Ingredients
```json
POST /api/food/dishes/by-ingredients
{
  "ingredients": ["chicken", "tomatoes", "pasta"]
}
```

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses include a `message` field with details.

## Development

The service uses:
- **Express.js** - Web framework
- **Supabase** - Database
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## Health Check

```
GET /health
```

Returns service status and timestamp. 