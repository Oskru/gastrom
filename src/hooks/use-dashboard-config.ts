// src/hooks/use-dashboard-config.ts
import { useState, useCallback, useEffect } from 'react';
import {
  DashboardConfig,
  DashboardTile,
  DEFAULT_DASHBOARD_CONFIG,
  DashboardTileType,
} from '../types/dashboard';

const STORAGE_KEY = 'dashboard-config';

/**
 * Custom hook for managing dashboard configuration with localStorage persistence
 */
export const useDashboardConfig = () => {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as DashboardConfig;
        // Validate version and structure
        if (
          parsed.version === DEFAULT_DASHBOARD_CONFIG.version &&
          parsed.tiles
        ) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
    }
    return DEFAULT_DASHBOARD_CONFIG;
  });

  // Save config to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save dashboard config:', error);
    }
  }, [config]);

  const addTile = useCallback((type: DashboardTileType, width: number) => {
    setConfig(prev => ({
      ...prev,
      tiles: [
        ...prev.tiles,
        {
          id: `tile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type,
          width,
        },
      ],
    }));
  }, []);

  const removeTile = useCallback((id: string) => {
    setConfig(prev => ({
      ...prev,
      tiles: prev.tiles.filter(tile => tile.id !== id),
    }));
  }, []);

  const updateTileOrder = useCallback((tiles: DashboardTile[]) => {
    setConfig(prev => ({
      ...prev,
      tiles,
    }));
  }, []);

  const updateTileWidth = useCallback((id: string, width: number) => {
    setConfig(prev => ({
      ...prev,
      tiles: prev.tiles.map(tile =>
        tile.id === id ? { ...tile, width } : tile
      ),
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setConfig(DEFAULT_DASHBOARD_CONFIG);
  }, []);

  return {
    config,
    addTile,
    removeTile,
    updateTileOrder,
    updateTileWidth,
    resetToDefault,
  };
};
