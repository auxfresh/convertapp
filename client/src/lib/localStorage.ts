// localStorage.ts
import { ConversionRecord as FirebaseConversionRecord } from './firebase';

export interface ConversionRecord extends Omit<FirebaseConversionRecord, 'id'> {
  id: string;
  timestamp: number;
}

export interface UserData {
  email: string;
  name: string;
  uid: string;
}

interface StoredUser {
  id: number;
  email: string;
  name: string;
  firebaseUid: string;
}

const CONVERSIONS_KEY = 'unit_converter_conversions';
const USER_KEY = 'unit_converter_user';

export const saveConversionToLocalStorage = (conversion: Omit<ConversionRecord, 'id' | 'timestamp'>): string => {
  const conversions = getConversionsFromLocalStorage();
  const newConversion: ConversionRecord = {
    ...conversion,
    id: Date.now().toString(),
    timestamp: Date.now(),
  };
  conversions.push(newConversion);
  localStorage.setItem(CONVERSIONS_KEY, JSON.stringify(conversions));
  return newConversion.id;
};

export const getConversionsFromLocalStorage = (): ConversionRecord[] => {
  const conversionsData = localStorage.getItem(CONVERSIONS_KEY);
  return conversionsData ? JSON.parse(conversionsData) : [];
};

export const clearConversionHistory = (): void => {
  localStorage.removeItem(CONVERSIONS_KEY);
};

export const saveUserToLocalStorage = (user: UserData | StoredUser): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUserFromLocalStorage = (): UserData | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const removeUserFromLocalStorage = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const clearUserFromLocalStorage = (): void => {
  localStorage.removeItem(USER_KEY);
};