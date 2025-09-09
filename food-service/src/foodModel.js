const supabase = require('./supabaseClient');

class FoodModel {
  // Get all dishes with optional filtering
  static async getAllDishes(filters = {}) {
    try {
      let query = supabase
        .from('recipes')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.mood) {
        query = query.eq('mood', filters.mood);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      
      // Filter active recipes by default (unless explicitly requested)
      if (filters.include_inactive !== 'true' && filters.include_inactive !== true) {
        query = query.eq('is_active', true);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Supabase error in getAllDishes:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getAllDishes:', error);
      throw new Error(`Error fetching dishes: ${error.message}`);
    }
  }

// Get dish by ID
  static async getDishById(id) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error in getDishById:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getDishById:', error);
      throw new Error(`Error fetching dish: ${error.message}`);
    }
  }

  // Create new dish
  static async createDish(dishData) {
    try {
      console.log('Creating dish with data:', dishData);
      
      const { data, error } = await supabase
        .from('recipes')
        .insert([dishData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error in createDish:', error);
        throw error;
      }
      
      console.log('Successfully created dish:', data);
      return data;
    } catch (error) {
      console.error('Error in createDish:', error);
      throw new Error(`Error creating dish: ${error.message}`);
    }
  }

  // Update dish
  static async updateDish(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error in updateDish:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in updateDish:', error);
      throw new Error(`Error updating dish: ${error.message}`);
    }
  }

  // Delete dish
  static async deleteDish(id) {
    try {
      const { error } = await supabase
        .from('recipes')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error in deleteDish:', error);
        throw error;
      }
      return { success: true };
    } catch (error) {
      console.error('Error in deleteDish:', error);
      throw new Error(`Error deleting dish: ${error.message}`);
    }
  }

  // Get dishes by user (including inactive ones for management)
  static async getDishesByUser(userId) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error in getDishesByUser:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getDishesByUser:', error);
      throw new Error(`Error fetching user dishes: ${error.message}`);
    }
  }

  // Get dishes by mood
  static async getDishesByMood(mood) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('mood', mood)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error in getDishesByMood:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getDishesByMood:', error);
      throw new Error(`Error fetching dishes by mood: ${error.message}`);
    }
  }

  // Search dishes
  static async searchDishes(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ingredients.cs.{${searchTerm}}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error in searchDishes:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in searchDishes:', error);
      throw new Error(`Error searching dishes: ${error.message}`);
    }
  }

  // Get dishes with ingredients filter
  static async getDishesByIngredients(ingredients) {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .overlaps('ingredients', ingredients)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error in getDishesByIngredients:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error in getDishesByIngredients:', error);
      throw new Error(`Error fetching dishes by ingredients: ${error.message}`);
    }
  }
}

module.exports = FoodModel; 