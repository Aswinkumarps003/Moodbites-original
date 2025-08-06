// In a real app, this data would come from an API
export const mockDishes = [
  {
    id: 1,
    name: 'Margherita Pizza',
    cuisine: 'Italian',
    description: 'A classic pizza with fresh mozzarella, tomatoes, and basil.',
    image: '/src/assets/images/pizza.jpg', // Path relative to the public folder
    rating: 4.5,
    ingredients: ['Pizza Dough', 'Tomatoes', 'Fresh Mozzarella', 'Basil', 'Olive Oil'],
    recipe: '1. Preheat oven to 475°F (245°C). 2. Roll out dough. 3. Top with sauce, cheese, and basil. 4. Bake for 10-12 minutes.'
  },
  {
    id: 2,
    name: 'Sushi Platter',
    cuisine: 'Japanese',
    description: 'An assortment of fresh nigiri and maki rolls.',
    image: '/src/assets/images/sushi.jpg',
    rating: 4.8,
    ingredients: ['Sushi Rice', 'Nori', 'Fresh Salmon', 'Tuna', 'Avocado', 'Cucumber'],
    recipe: '1. Prepare sushi rice. 2. Place nori on a bamboo mat. 3. Spread rice on nori. 4. Add fillings and roll tightly. 5. Slice and serve.'
  },
  {
    id: 3,
    name: 'Carne Asada Tacos',
    cuisine: 'Mexican',
    description: 'Grilled steak tacos with cilantro, onions, and a squeeze of lime.',
    image: '/src/assets/images/tacos.jpg',
    rating: 4.7,
    ingredients: ['Skirt Steak', 'Corn Tortillas', 'Cilantro', 'Onion', 'Lime'],
    recipe: '1. Marinate and grill the steak. 2. Chop the steak into small pieces. 3. Warm tortillas. 4. Serve steak in tortillas with cilantro and onion.'
  },
];

// Add more dishes as needed...