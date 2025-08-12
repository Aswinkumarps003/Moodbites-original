// moodToSpoonacular.js
export const moodToFoodQuery = {
  joy: "dessert",
  sadness: "comfort food",
  anger: "spicy chicken",
  fear: "soothing soup",
  disgust: "light salad",
  surprise: "fusion cuisine",
  neutral: "pasta"
};

// Enhanced mapping with multiple search terms for better results
export const moodToFoodQueries = {
  joy: ["dessert", "sweet treats", "celebration food", "colorful dishes"],
  sadness: ["comfort food", "warm soup", "chocolate", "homemade bread"],
  anger: ["spicy food", "hot sauce", "chili", "fiery dishes"],
  fear: ["soothing soup", "calming tea", "gentle flavors", "easy recipes"],
  surprise: ["fusion cuisine", "exotic dishes", "unusual combinations", "adventurous food"],
  disgust: ["light salad", "fresh ingredients", "clean eating", "simple recipes"],
  neutral: ["pasta", "balanced meals", "classic dishes", "everyday food"]
};

// Get primary search term for a mood
export function getPrimaryFoodQuery(mood) {
  return moodToFoodQuery[mood.toLowerCase()] || "pasta";
}

// Get all search terms for a mood
export function getAllFoodQueries(mood) {
  return moodToFoodQueries[mood.toLowerCase()] || ["pasta"];
}

// Get random search term for variety
export function getRandomFoodQuery(mood) {
  const queries = getAllFoodQueries(mood);
  return queries[Math.floor(Math.random() * queries.length)];
}
