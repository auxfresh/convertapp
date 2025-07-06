
// Local Storage utilities for user data and conversion history
export interface ConversionRecord {
  id: string;
  type: string;
  fromUnit: string;
  toUnit: string;
  fromValue: number;
  toValue: number;
  exchangeRate?: number;
  timestamp: number;
}

export interface UserData {
  email: string;
  name: string;
  uid: string;
}

// User authentication
export const saveUserToLocalStorage = (user: UserData) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const getUserFromLocalStorage = (): UserData | null => {
  const userData = localStorage.getItem('currentUser');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem('currentUser');
};

// Conversion history
export const saveConversionToLocalStorage = (conversion: Omit<ConversionRecord, 'id' | 'timestamp'>): string => {
  const conversions = getConversionsFromLocalStorage();
  const newConversion: ConversionRecord = {
    ...conversion,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  
  conversions.unshift(newConversion); // Add to beginning for most recent first
  
  // Keep only last 100 conversions to prevent localStorage from getting too large
  const limitedConversions = conversions.slice(0, 100);
  
  localStorage.setItem('conversionHistory', JSON.stringify(limitedConversions));
  return newConversion.id;
};

export const getConversionsFromLocalStorage = (): ConversionRecord[] => {
  const conversions = localStorage.getItem('conversionHistory');
  return conversions ? JSON.parse(conversions) : [];
};

export const clearConversionHistory = () => {
  localStorage.removeItem('conversionHistory');
};

// Favorites
export interface FavoriteConversion {
  id: string;
  type: string;
  fromUnit: string;
  toUnit: string;
  name?: string;
}

export const saveFavoriteToLocalStorage = (favorite: Omit<FavoriteConversion, 'id'>): string => {
  const favorites = getFavoritesFromLocalStorage();
  const newFavorite: FavoriteConversion = {
    ...favorite,
    id: Date.now().toString(),
  };
  
  favorites.push(newFavorite);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  return newFavorite.id;
};

export const getFavoritesFromLocalStorage = (): FavoriteConversion[] => {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
};

export const removeFavoriteFromLocalStorage = (id: string) => {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter(fav => fav.id !== id);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
};
