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
      
      // Use exchangerate.host for real-time exchange rates (free, no API key required)
      const response = await fetch(`https://api.exchangerate.host/latest?base=${base}&places=6`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error('Exchange rate API returned error');
      }
      
      res.json(data.rates);
    } catch (error) {
      console.error("Exchange rate error:", error);
      
      // Try backup API (Fawaz Ahmed's currency API)
      try {
        const backupResponse = await fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base.toLowerCase()}.json`);
        const backupData = await backupResponse.json();
        
        if (backupData[base.toLowerCase()]) {
          // Convert to uppercase currency codes for consistency
          const rates: { [key: string]: number } = {};
          Object.entries(backupData[base.toLowerCase()]).forEach(([currency, rate]) => {
            rates[currency.toUpperCase()] = rate as number;
          });
          return res.json(rates);
        }
      } catch (backupError) {
        console.error("Backup exchange rate API error:", backupError);
      }
      
      res.status(500).json({ error: "Failed to fetch exchange rates" });
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
