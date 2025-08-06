import { mockDishes } from '../data/mockDishes';

// Simulates fetching all dishes with a delay
export const fetchDishes = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDishes);
    }, 500); // 500ms delay to simulate network latency
  });
};

// Simulates fetching a single dish by its ID
export const fetchDishById = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const dish = mockDishes.find((d) => d.id === parseInt(id));
      if (dish) {
        resolve(dish);
      } else {
        reject(new Error('Dish not found'));
      }
    }, 300);
  });
};