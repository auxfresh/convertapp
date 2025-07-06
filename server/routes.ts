import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertConversionSchema, insertFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { uid, email, name } = req.body;
      
      if (!uid || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if user already exists
      let user = await storage.getUserByFirebaseUid(uid);
      
      if (!user) {
        // Create new user
        const userData = insertUserSchema.parse({
          email,
          name: name || email,
          firebaseUid: uid,
        });
        user = await storage.createUser(userData);
      } else {
        // Update existing user if needed
        if (user.email !== email || user.name !== name) {
          user = await storage.updateUser(user.id, { email, name: name || email });
        }
      }

      res.json(user);
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Exchange rates endpoint
  app.get("/api/exchange-rates/:base", async (req, res) => {
    try {
      const { base } = req.params;
      const API_KEY = process.env.EXCHANGE_RATE_API_KEY || "demo-key";
      
      // Use exchangerate-api.com for real exchange rates
      const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`);
      
      if (!response.ok) {
        // Fallback to mock data if API fails
        const mockRates = {
          USD: { EUR: 0.8527, GBP: 0.7923, JPY: 149.87, CAD: 1.3456, AUD: 1.5234, CHF: 0.8834, CNY: 7.2345 },
          EUR: { USD: 1.1728, GBP: 0.9291, JPY: 175.78, CAD: 1.5789, AUD: 1.7856, CHF: 1.0359, CNY: 8.4892 },
          GBP: { USD: 1.2619, EUR: 1.0763, JPY: 189.12, CAD: 1.6987, AUD: 1.9234, CHF: 1.1145, CNY: 9.1347 },
        };
        
        const rates = mockRates[base as keyof typeof mockRates] || mockRates.USD;
        return res.json(rates);
      }

      const data = await response.json();
      res.json(data.conversion_rates);
    } catch (error) {
      console.error("Exchange rate error:", error);
      // Return mock data on error
      const mockRates = {
        EUR: 0.8527,
        GBP: 0.7923,
        JPY: 149.87,
        CAD: 1.3456,
        AUD: 1.5234,
        CHF: 0.8834,
        CNY: 7.2345
      };
      res.json(mockRates);
    }
  });

  // Conversion routes
  app.get("/api/conversions", async (req, res) => {
    try {
      const userHeader = req.headers['x-user-id'];
      if (!userHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = parseInt(userHeader as string);
      const conversions = await storage.getConversions(userId);
      res.json(conversions);
    } catch (error) {
      console.error("Get conversions error:", error);
      res.status(500).json({ message: "Failed to fetch conversions" });
    }
  });

  app.get("/api/conversions/count", async (req, res) => {
    try {
      const userHeader = req.headers['x-user-id'];
      if (!userHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = parseInt(userHeader as string);
      const count = await storage.getConversionsCount(userId);
      res.json(count);
    } catch (error) {
      console.error("Get conversions count error:", error);
      res.status(500).json({ message: "Failed to fetch conversions count" });
    }
  });

  app.post("/api/conversions", async (req, res) => {
    try {
      const userHeader = req.headers['x-user-id'];
      if (!userHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = parseInt(userHeader as string);
      const conversionData = insertConversionSchema.parse({
        ...req.body,
        userId,
      });
      
      const conversion = await storage.createConversion(conversionData);
      res.json(conversion);
    } catch (error) {
      console.error("Create conversion error:", error);
      res.status(500).json({ message: "Failed to save conversion" });
    }
  });

  app.delete("/api/conversions", async (req, res) => {
    try {
      const userHeader = req.headers['x-user-id'];
      if (!userHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = parseInt(userHeader as string);
      await storage.deleteUserConversions(userId);
      res.json({ message: "Conversion history cleared" });
    } catch (error) {
      console.error("Clear conversions error:", error);
      res.status(500).json({ message: "Failed to clear conversions" });
    }
  });

  // Favorites routes
  app.get("/api/favorites", async (req, res) => {
    try {
      const userHeader = req.headers['x-user-id'];
      if (!userHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = parseInt(userHeader as string);
      const favorites = await storage.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Get favorites error:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const userHeader = req.headers['x-user-id'];
      if (!userHeader) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const userId = parseInt(userHeader as string);
      
      // Check if favorite already exists
      const existing = await storage.getFavoriteByUserAndUnits(
        userId,
        req.body.type,
        req.body.fromUnit,
        req.body.toUnit
      );
      
      if (existing) {
        return res.status(409).json({ message: "Favorite already exists" });
      }
      
      const favoriteData = insertFavoriteSchema.parse({
        ...req.body,
        userId,
      });
      
      const favorite = await storage.createFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      console.error("Create favorite error:", error);
      res.status(500).json({ message: "Failed to save favorite" });
    }
  });

  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteFavorite(parseInt(id));
      res.json({ message: "Favorite removed" });
    } catch (error) {
      console.error("Delete favorite error:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
