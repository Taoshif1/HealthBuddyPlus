export interface MoodEntry {
  id: string;
  mood: 'excellent' | 'good' | 'okay' | 'poor' | 'terrible';
  date: string;
  notes?: string;
  userId: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface MealPlan {
  id: string;
  date: string;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snacks?: Recipe[];
  };
  userId: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  userId: string;
}

export interface Activity {
  id: string;
  type: string;
  duration: number; // minutes
  intensity: 'low' | 'medium' | 'high';
  date: string;
  notes?: string;
  userId: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  earned: boolean;
  earnedDate?: string;
}

export interface EncouragementPost {
  id: string;
  message: string;
  author: string;
  timestamp: string;
  likes: number;
  likedBy: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences: {
    notifications: boolean;
    publicProfile: boolean;
    units: 'metric' | 'imperial';
  };
}