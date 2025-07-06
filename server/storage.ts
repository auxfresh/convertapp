import { users, conversions, favorites, type User, type InsertUser, type Conversion, type InsertConversion, type Favorite, type InsertFavorite } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Conversion operations
  getConversions(userId: number): Promise<Conversion[]>;
  getConversionsCount(userId: number): Promise<number>;
  createConversion(conversion: InsertConversion): Promise<Conversion>;
  deleteUserConversions(userId: number): Promise<void>;

  // Favorite operations
  getFavorites(userId: number): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<void>;
  getFavoriteByUserAndUnits(userId: number, type: string, fromUnit: string, toUnit: string): Promise<Favorite | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private conversions: Map<number, Conversion>;
  private favorites: Map<number, Favorite>;
  private currentUserId: number;
  private currentConversionId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.conversions = new Map();
    this.favorites = new Map();
    this.currentUserId = 1;
    this.currentConversionId = 1;
    this.currentFavoriteId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.firebaseUid === firebaseUid);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Conversion operations
  async getConversions(userId: number): Promise<Conversion[]> {
    return Array.from(this.conversions.values())
      .filter(conversion => conversion.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getConversionsCount(userId: number): Promise<number> {
    return Array.from(this.conversions.values())
      .filter(conversion => conversion.userId === userId).length;
  }

  async createConversion(insertConversion: InsertConversion): Promise<Conversion> {
    const id = this.currentConversionId++;
    const conversion: Conversion = {
      ...insertConversion,
      id,
      createdAt: new Date()
    };
    this.conversions.set(id, conversion);
    return conversion;
  }

  async deleteUserConversions(userId: number): Promise<void> {
    for (const [id, conversion] of this.conversions.entries()) {
      if (conversion.userId === userId) {
        this.conversions.delete(id);
      }
    }
  }

  // Favorite operations
  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values())
      .filter(favorite => favorite.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = {
      ...insertFavorite,
      id,
      createdAt: new Date()
    };
    this.favorites.set(id, favorite);
    return favorite;
  }

  async deleteFavorite(id: number): Promise<void> {
    this.favorites.delete(id);
  }

  async getFavoriteByUserAndUnits(userId: number, type: string, fromUnit: string, toUnit: string): Promise<Favorite | undefined> {
    return Array.from(this.favorites.values()).find(
      favorite => 
        favorite.userId === userId && 
        favorite.type === type && 
        favorite.fromUnit === fromUnit && 
        favorite.toUnit === toUnit
    );
  }
}

export const storage = new MemStorage();
