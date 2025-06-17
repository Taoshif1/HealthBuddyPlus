// src/components/MealPlanner.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UtensilsCrossed, 
  Search, 
  Clock, 
  Users, 
  ChefHat,
  Plus,
  Heart,
  ShoppingCart,
  Sparkles,
  CalendarDays,
  X,
  PlusCircle,
  BookHeart,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Recipe {
  id: string;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

interface ToastMessage {
    id: number;
    message: string;
    icon: React.ReactNode;
}

// --- MOCK RECIPE DATABASE ---
// Expanded list of recipes to make AI suggestions more varied
const allRecipes: Recipe[] = [
    { id: '1', name: 'Mediterranean Quinoa Bowl', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', prepTime: 15, cookTime: 20, servings: 2, difficulty: 'Easy', calories: 420, ingredients: ['quinoa', 'cucumber', 'tomatoes', 'feta cheese', 'olive oil', 'lemon'], instructions: ['Cook quinoa', 'Dice veggies', 'Mix all'], tags: ['healthy', 'vegetarian', 'gluten-free'] },
    { id: '2', name: 'Honey Garlic Chicken Stir-fry', image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', prepTime: 10, cookTime: 15, servings: 4, difficulty: 'Medium', calories: 380, ingredients: ['chicken breast', 'broccoli', 'bell peppers', 'garlic', 'honey', 'soy sauce'], instructions: ['Cut chicken', 'Stir-fry with veggies', 'Add sauce'], tags: ['protein', 'quick', 'asian'] },
    { id: '3', name: 'Avocado Toast with Egg', image: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', prepTime: 5, cookTime: 8, servings: 1, difficulty: 'Easy', calories: 340, ingredients: ['bread', 'avocado', 'eggs', 'chili flakes'], instructions: ['Toast bread', 'Mash avocado', 'Top with egg'], tags: ['breakfast', 'quick'] },
    { id: '4', name: 'Spicy Salmon with Asparagus', image: 'https://images.pexels.com/photos/6210876/pexels-photo-6210876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', prepTime: 10, cookTime: 25, servings: 2, difficulty: 'Medium', calories: 550, ingredients: ['salmon fillet', 'asparagus', 'chili powder', 'garlic', 'olive oil'], instructions: ['Season salmon', 'Roast with asparagus'], tags: ['seafood', 'healthy', 'low-carb'] },
    { id: '5', name: 'Vegan Lentil Soup', image: 'https://images.pexels.com/photos/518214/pexels-photo-518214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', prepTime: 15, cookTime: 40, servings: 6, difficulty: 'Easy', calories: 250, ingredients: ['lentils', 'carrots', 'celery', 'onion', 'vegetable broth'], instructions: ['Sauté veggies', 'Add lentils and broth', 'Simmer until tender'], tags: ['vegan', 'soup', 'comfort-food'] },
    { id: '6', name: 'Berry Smoothie Bowl', image: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', prepTime: 10, cookTime: 0, servings: 1, difficulty: 'Easy', calories: 310, ingredients: ['frozen berries', 'banana', 'almond milk', 'granola', 'chia seeds'], instructions: ['Blend fruits', 'Top with granola and seeds'], tags: ['breakfast', 'vegan', 'healthy-snack'] }
];

// --- COMPONENT START ---
const MealPlanner: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>(allRecipes.slice(0, 3));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([ 'chicken breast', 'rice', 'broccoli', 'eggs', 'spinach', 'tomatoes' ]);
  const [newIngredient, setNewIngredient] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // States for new functionality
  const [favorites, setFavorites] = useState<string[]>(['2']);
  const [mealPlan, setMealPlan] = useState<Record<string, string[]>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, icon: React.ReactNode) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const toggleFavorite = (recipeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
        prev.includes(recipeId) 
            ? prev.filter(id => id !== recipeId) 
            : [...prev, recipeId]
    );
    addToast(
        favorites.includes(recipeId) ? 'Removed from favorites' : 'Saved to favorites!', 
        <Heart className="w-5 h-5 text-pink-500" />
    );
  };
  
  const addToMealPlan = (recipeName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // For the demo, we'll just add to a generic list
    setMealPlan(prev => ({...prev, today: [...(prev.today || []), recipeName]}));
    addToast(`Added ${recipeName} to your plan!`, <CalendarDays className="w-5 h-5 text-blue-500" />);
    setSelectedRecipe(null);
  }

  const handleGenerateRecipes = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Find new recipes that aren't already shown
      const currentIds = new Set(recipes.map(r => r.id));
      const newRecipe = allRecipes.find(r => !currentIds.has(r.id));
      if (newRecipe) {
        setRecipes(prev => [...prev, newRecipe]);
      } else {
        addToast("No more recipes to show!", <X className="w-5 h-5 text-red-500"/>);
      }
      setIsGenerating(false);
    }, 1500); // Simulate AI thinking time
  };

  const filteredRecipes = recipes.filter(recipe => {
    const searchMatch = searchTerm.length > 2 ? 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      recipe.tags.some(tag => tag.includes(searchTerm.toLowerCase()))
      : true;
    
    const mealTypeMatch = selectedMealType === 'all' || recipe.tags.includes(selectedMealType);

    return searchMatch && mealTypeMatch;
  });

  const mealTypes = [
    { id: 'all', label: 'All', icon: '🍲' },
    { id: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { id: 'lunch', label: 'Lunch', icon: '🌞' },
    { id: 'dinner', label: 'Dinner', icon: '🌙' },
  ];

  const addIngredient = () => {
    if (newIngredient && !availableIngredients.includes(newIngredient.toLowerCase())) {
        setAvailableIngredients([...availableIngredients, newIngredient.toLowerCase()]);
        setNewIngredient('');
    }
  };

  return (
    <>
      {/* Toast Notification Container */}
      <div className="fixed top-5 right-5 z-[100] space-y-2">
        <AnimatePresence>
            {toasts.map(toast => (
                <motion.div
                    key={toast.id}
                    layout
                    initial={{ opacity: 0, y: -50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-2xl border border-neutral-100"
                >
                    {toast.icon}
                    <span className="font-medium text-neutral-700">{toast.message}</span>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-bold text-neutral-800 mb-2">Smart Meal Planner</h1>
          <p className="text-neutral-500 text-lg">Discover delicious recipes tailored to you.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <div className="flex items-center mb-4">
                  <ShoppingCart className="w-6 h-6 text-primary-500 mr-3" />
                  <h3 className="text-xl font-semibold text-neutral-800">Your Pantry</h3>
                </div>
                <div className="flex space-x-2 mb-4">
                  <input type="text" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} placeholder="Add ingredient..." className="flex-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" onKeyPress={(e) => e.key === 'Enter' && addIngredient()} />
                  <motion.button onClick={addIngredient} className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors" whileTap={{ scale: 0.9 }}>
                    <Plus className="w-5 h-5" />
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableIngredients.map((ing) => (
                    <motion.span key={ing} className="px-3 py-1 bg-primary-50 text-primary-800 rounded-full text-sm font-medium border border-primary-200 cursor-pointer hover:bg-primary-100">{ing}</motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                <div className="flex items-center mb-4">
                  <CalendarDays className="w-6 h-6 text-secondary-500 mr-3" />
                  <h3 className="text-xl font-semibold text-neutral-800">Meal Type</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {mealTypes.map((type) => (
                    <motion.button key={type.id} onClick={() => setSelectedMealType(type.id)} className={`p-3 rounded-lg text-left transition-all duration-200 flex items-center gap-2 ${selectedMealType === type.id ? 'bg-secondary-500 text-white shadow-md' : 'bg-neutral-100 hover:bg-neutral-200'}`} whileTap={{scale: 0.95}}>
                      <span className="text-lg">{type.icon}</span><span className="font-medium">{type.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <motion.div className="relative mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search for recipes, tags, or ingredients..." className="w-full pl-12 pr-4 py-3 border border-neutral-300 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"/>
            </motion.div>

            <motion.div className="flex items-center justify-between mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
              <h2 className="text-2xl font-bold text-neutral-800">Recipe Suggestions</h2>
              <motion.button onClick={handleGenerateRecipes} disabled={isGenerating} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent-500 to-yellow-500 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300" whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Thinking...' : 'Generate AI Recipes'}
              </motion.button>
            </motion.div>
            
            <AnimatePresence>
                <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" layout>
                    {filteredRecipes.map((recipe, index) => (
                    <motion.div layout key={recipe.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }} className="bg-white rounded-2xl shadow-lg border border-neutral-100 overflow-hidden cursor-pointer group" onClick={() => setSelectedRecipe(recipe)}>
                        <div className="relative">
                        <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/f0f0f0/333?text=Image+Error'; }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <button onClick={(e) => toggleFavorite(recipe.id, e)} className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:text-pink-400 transition-colors">
                            <Heart className={`w-5 h-5 ${favorites.includes(recipe.id) ? 'text-pink-500 fill-current' : ''}`} />
                        </button>
                        <h3 className="absolute bottom-3 left-4 text-xl font-bold text-white drop-shadow-md">{recipe.name}</h3>
                        </div>
                        <div className="p-4 flex justify-between items-center text-sm text-neutral-500">
                            <span className="flex items-center gap-1.5"><Clock size={16} /> {recipe.prepTime + recipe.cookTime}m</span>
                            <span className="flex items-center gap-1.5"><ChefHat size={16} /> {recipe.calories} kcal</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{recipe.difficulty}</span>
                        </div>
                    </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* Recipe Modal */}
        <AnimatePresence>
          {selectedRecipe && (
            <motion.div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedRecipe(null)}>
              <motion.div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-3xl font-bold text-neutral-800">{selectedRecipe.name}</h2>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedRecipe.tags.map(tag => <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">{tag}</span>)}
                            </div>
                        </div>
                        <button onClick={() => setSelectedRecipe(null)} className="p-2 rounded-full hover:bg-neutral-100 transition-colors"><X className="w-5 h-5" /></button>
                    </div>
                    <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-64 object-cover rounded-xl mb-6" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/e0e0e0/555?text=Image+Missing'; }}/>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
                        <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-sm text-neutral-500">Prep Time</p><p className="font-bold text-lg">{selectedRecipe.prepTime}m</p></div>
                        <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-sm text-neutral-500">Cook Time</p><p className="font-bold text-lg">{selectedRecipe.cookTime}m</p></div>
                        <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-sm text-neutral-500">Servings</p><p className="font-bold text-lg">{selectedRecipe.servings}</p></div>
                        <div className="bg-neutral-50 p-3 rounded-lg"><p className="text-sm text-neutral-500">Calories</p><p className="font-bold text-lg">{selectedRecipe.calories}</p></div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Ingredients</h3>
                            <ul className="space-y-2">
                                {selectedRecipe.ingredients.map((ing, i) => <li key={i} className="flex items-center gap-3"><span className="w-2 h-2 bg-primary-400 rounded-full"></span><span className="text-neutral-700">{ing}</span></li>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-neutral-800 mb-3">Instructions</h3>
                            <ol className="space-y-4">
                                {selectedRecipe.instructions.map((inst, i) => <li key={i} className="flex gap-3"><span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-sm">{i+1}</span><span className="text-neutral-700">{inst}</span></li>)}
                            </ol>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-3 mt-8 pt-6 border-t border-neutral-200">
                        <motion.button onClick={(e) => addToMealPlan(selectedRecipe.name, e)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 font-semibold transition-all shadow-md hover:shadow-lg" whileTap={{scale:0.98}}><PlusCircle size={20}/>Add to Meal Plan</motion.button>
                        <motion.button onClick={(e) => toggleFavorite(selectedRecipe.id, e)} className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-100 font-semibold transition-colors" whileTap={{scale:0.98}}><BookHeart size={20}/>{favorites.includes(selectedRecipe.id) ? 'Remove from Favorites' : 'Save to Favorites'}</motion.button>
                    </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default MealPlanner;
