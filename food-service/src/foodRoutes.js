const express = require('express');
const router = express.Router();
const { 
  getAllDishes, 
  getDishById, 
  createDish, 
  updateDish, 
  deleteDish, 
  getDishesByUser, 
  getDishesByMood, 
  searchDishes, 
  getDishesByIngredients,
  uploadRecipeImage,
  toggleDishStatus
} = require('./foodController');
const { upload } = require('./cloudinaryConfig');

// Recipe image upload route
router.post('/upload-recipe-image', upload.single('recipeImage'), uploadRecipeImage);

// Recipe CRUD routes
router.get('/dishes', getAllDishes);
router.get('/dishes/:id', getDishById);
router.post('/dishes', createDish);
router.put('/dishes/:id', updateDish);
router.delete('/dishes/:id', deleteDish);

// Recipe management routes
router.patch('/dishes/:id/status', toggleDishStatus);

// User-specific routes
router.get('/users/:userId/dishes', getDishesByUser);

// Filter and search routes
router.get('/dishes/mood/:mood', getDishesByMood);
router.get('/dishes/search', searchDishes);
router.get('/dishes/ingredients', getDishesByIngredients);

module.exports = router;