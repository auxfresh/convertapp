// localStorage.ts
import { ConversionRecord as FirebaseConversionRecord } from './firebase';

export interface ConversionRecord extends Omit<FirebaseConversionRecord, 'id'> {
  id: string;
  timestamp: number;
}

interface StoredUser {
  id: number;
  email: string;
  name: string;
  firebaseUid: string;
}

const CONVERSIONS_KEY = 'unit_converter_conversions';
const USER_KEY = 'unit_converter_user';

export const clearConversionHistory = (): void => {
  localStorage.removeItem(CONVERSIONS_KEY);
};

export const saveUserToLocalStorage = (user: StoredUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserFromLocalStorage = (): StoredUser | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const clearUserFromLocalStorage = (): void => {
  localStorage.removeItem(USER_KEY);
};