const FoodModel = require('./foodModel');

// Upload Recipe Image to Cloudinary
const uploadRecipeImage = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    // Log the Cloudinary upload result for debugging

    // Get the uploaded file info from Cloudinary
    const secure_url = req.file.secure_url || req.file.path;
    const public_id = req.file.public_id || req.file.filename || req.file.public_id;
    
    if (!secure_url) {
      return res.status(500).json({ message: 'Cloudinary upload did not return expected URL', file: req.file });
    }

    res.status(200).json({ 
      message: 'Recipe image uploaded successfully',
      image_url: secure_url,
      public_id: public_id
    });

  } catch (error) {
    console.error('Upload recipe image error:', error);
    res.status(500).json({ message: 'Server error during recipe image upload' });
  }
};

// Get all dishes with optional filters
const getAllDishes = async (req, res) => {
  try {
    const filters = {
      mood: req.query.mood,
      user_id: req.query.user_id,
      difficulty: req.query.difficulty,
      search: req.query.search
    };

    const dishes = await FoodModel.getAllDishes(filters);
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dish by ID (for editing)
const getDishById = async (req, res) => {
  try {
    const { id } = req.params;
    const dish = await FoodModel.getDishById(id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.json(dish);
  } catch (error) {
    console.error('Error fetching dish:', error);
    res.status(500).json({ message: error.message });
  }
};

// Create new dish
const createDish = async (req, res) => {
  try {
    console.log('Received create dish request:', req.body);
    
    const {
      title,
      mood,
      cook_time,
      servings,
      difficulty,
      description,
      ingredients,
      instructions,
      tags,
      image_url,
      user_id
    } = req.body;

    // Validation
    if (!title || !mood || !user_id) {
      return res.status(400).json({ 
        message: 'Title, mood, and user_id are required' 
      });
    }

    // Prepare dish data
    const dishData = {
      title: title.trim(),
      mood: mood.trim(),
      cook_time: cook_time || null,
      servings: servings ? parseInt(servings) : null,
      difficulty: difficulty || null,
      description: description || null,
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      instructions: Array.isArray(instructions) ? instructions : [],
      tags: Array.isArray(tags) ? tags : [],
      image_url: image_url || null,
      user_id: user_id
    };

    

    const newDish = await FoodModel.createDish(dishData);
   
    res.status(201).json(newDish);
  } catch (error) {
    console.error('Error creating dish in controller:', error);
    res.status(500).json({ 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update dish
const updateDish = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.user_id; // Prevent changing ownership

    // Validate required fields
    if (!updateData.title || !updateData.mood) {
      return res.status(400).json({ 
        message: 'Title and mood are required' 
      });
    }

    // Prepare update data
    const dishData = {
      title: updateData.title.trim(),
      mood: updateData.mood.trim(),
      cook_time: updateData.cook_time || null,
      servings: updateData.servings ? parseInt(updateData.servings) : null,
      difficulty: updateData.difficulty || null,
      description: updateData.description || null,
      ingredients: Array.isArray(updateData.ingredients) ? updateData.ingredients : [],
      instructions: Array.isArray(updateData.instructions) ? updateData.instructions : [],
      tags: Array.isArray(updateData.tags) ? updateData.tags : [],
      image_url: updateData.image_url || null,
      is_active: updateData.is_active !== undefined ? updateData.is_active : true
    };

    console.log('Updating dish with data:', dishData);

    const updatedDish = await FoodModel.updateDish(id, dishData);
    
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    console.log('Successfully updated dish:', updatedDish);
    res.json(updatedDish);
  } catch (error) {
    console.error('Error updating dish:', error);
    res.status(500).json({ 
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Deactivate/Activate dish
const toggleDishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ message: 'is_active must be a boolean value' });
    }

    const updatedDish = await FoodModel.updateDish(id, { is_active });
    
    if (!updatedDish) {
      return res.status(404).json({ message: 'Dish not found' });
    }

    const statusText = is_active ? 'activated' : 'deactivated';
    res.json({ 
      message: `Recipe ${statusText} successfully`,
      dish: updatedDish
    });
  } catch (error) {
    console.error('Error toggling dish status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete dish
const deleteDish = async (req, res) => {
  try {
    const { id } = req.params;
    await FoodModel.deleteDish(id);
    res.json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error('Error deleting dish:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dishes by user
const getDishesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const dishes = await FoodModel.getDishesByUser(userId);
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching user dishes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dishes by mood
const getDishesByMood = async (req, res) => {
  try {
    const { mood } = req.params;
    const dishes = await FoodModel.getDishesByMood(mood);
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes by mood:', error);
    res.status(500).json({ message: error.message });
  }
};

// Search dishes
const searchDishes = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const dishes = await FoodModel.searchDishes(q);
    res.json(dishes);
  } catch (error) {
    console.error('Error searching dishes:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get dishes by ingredients
const getDishesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients array is required' });
    }
    
    const dishes = await FoodModel.getDishesByIngredients(ingredients);
    res.json(dishes);
  } catch (error) {
    console.error('Error fetching dishes by ingredients:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadRecipeImage,
  getAllDishes,
  getDishById,
  createDish,
  updateDish,
  deleteDish,
  getDishesByUser,
  getDishesByMood,
  searchDishes,
  getDishesByIngredients,
  toggleDishStatus
}; 