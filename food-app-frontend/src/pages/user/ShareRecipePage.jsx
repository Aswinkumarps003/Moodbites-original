import { useState } from 'react';
import { Link } from 'react-router-dom';
import pizzaImg from '../../assets/images/pizza.jpg';
import saladImg from '../../assets/images/salad1.png';

const ShareRecipePage = () => {
  const [form, setForm] = useState({
    name: '',
    cuisine: '',
    description: '',
    ingredients: '',
    steps: '',
    image: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-pink-100 to-yellow-100 flex flex-col w-full">
      {/* Hero Section */}
      <div className="w-full py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-orange-200/60 via-pink-200/40 to-yellow-100/60 blur-2xl opacity-70 animate-pulse-slow z-0" />
        <div className="relative z-10 flex flex-col items-center">
          <img src={saladImg} alt="Share Recipe" className="w-28 h-28 mb-4 drop-shadow-xl animate-float-3d" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 mb-2 text-center drop-shadow-lg">Share Your Recipe</h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl text-center mb-2">Inspire others with your culinary creations! Submit your favorite recipe and join our food-loving community.</p>
        </div>
      </div>
      {/* Form Section */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 pb-16">
        {/* Food Illustration (desktop only) */}
        <div className="hidden md:flex flex-col items-center justify-center mr-10">
          <img src={pizzaImg} alt="Food Illustration" className="w-64 h-64 object-cover rounded-3xl shadow-2xl border-4 border-white/40 animate-float-3d" />
        </div>
        {/* Form Card */}
        <div className="w-full max-w-xl bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/30 relative">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1 mb-4 md:mb-0">
                  <label className="block font-bold mb-1 text-green-700">Recipe Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border-2 border-green-200 focus:ring-2 focus:ring-green-400 bg-white/80 shadow-inner transition-all" placeholder="e.g. Veggie Pizza" />
                </div>
                <div className="flex-1">
                  <label className="block font-bold mb-1 text-green-700">Cuisine</label>
                  <input type="text" name="cuisine" value={form.cuisine} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border-2 border-green-200 focus:ring-2 focus:ring-green-400 bg-white/80 shadow-inner transition-all" placeholder="e.g. Italian" />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1 text-green-700">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border-2 border-green-200 focus:ring-2 focus:ring-green-400 bg-white/80 shadow-inner transition-all" rows={2} placeholder="A short description of your recipe..." />
              </div>
              <div>
                <label className="block font-bold mb-1 text-green-700">Ingredients <span className="font-normal text-gray-500">(comma separated)</span></label>
                <input type="text" name="ingredients" value={form.ingredients} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border-2 border-green-200 focus:ring-2 focus:ring-green-400 bg-white/80 shadow-inner transition-all" placeholder="e.g. Flour, Cheese, Tomato..." />
              </div>
              <div>
                <label className="block font-bold mb-1 text-green-700">Steps / Instructions</label>
                <textarea name="steps" value={form.steps} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border-2 border-green-200 focus:ring-2 focus:ring-green-400 bg-white/80 shadow-inner transition-all" rows={4} placeholder="Step by step instructions..." />
              </div>
              <div>
                <label className="block font-bold mb-1 text-green-700">Image <span className="font-normal text-gray-500">(optional)</span></label>
                <input type="file" name="image" accept="image/*" onChange={handleChange} className="w-full" />
                {imagePreview && (
                  <div className="mt-3 flex justify-center">
                    <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-2xl shadow-lg border-2 border-green-200" />
                  </div>
                )}
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-lime-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-200 text-lg tracking-wide">Share Recipe</button>
            </form>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <img src={saladImg} alt="Success" className="w-32 h-32 mb-4 animate-float-3d" />
              <div className="text-3xl mb-4">🎉</div>
              <p className="text-lg font-semibold mb-2 text-green-700 text-center">Thank you for sharing your recipe!</p>
              <Link to="/" className="text-orange-600 hover:underline">Back to Home</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareRecipePage; 