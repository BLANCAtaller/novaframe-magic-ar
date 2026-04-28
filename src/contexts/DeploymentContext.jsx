'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DeploymentContext = createContext();

// Read and migrate localStorage data synchronously for initial state
function loadPersistedDeployments() {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('novaframe_deployments');
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // MIGRATION: split old items with quantity > 1 into separate items
    const migrated = [];
    parsed.forEach(item => {
      if (item.quantity > 1) {
        for (let i = 0; i < item.quantity; i++) {
          migrated.push({
            ...item,
            quantity: 1,
            deploymentId: `${item.deploymentId}-${i}` // ensure unique
          });
        }
      } else {
        migrated.push(item);
      }
    });
    return migrated;
  } catch (e) {
    console.error('Failed to load deployments', e);
    return [];
  }
}

export function DeploymentProvider({ children }) {
  const [deployedArtifacts, setDeployedArtifacts] = useState(loadPersistedDeployments);
  const isInitialized = useRef(true);

  // Save to localStorage on change
  useEffect(() => {
    if (isInitialized.current) {
      localStorage.setItem('novaframe_deployments', JSON.stringify(deployedArtifacts));
    }
  }, [deployedArtifacts]);

  const deployArtifact = (artifact) => {
    setDeployedArtifacts(prev => [...prev, {
      ...artifact,
      deploymentId: `DEP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      timestamp: new Date().toISOString()
    }]);
  };

  const updateArtifact = (deploymentId, updates) => {
    setDeployedArtifacts(prev => prev.map(a => 
      a.deploymentId === deploymentId ? { ...a, ...updates } : a
    ));
  };

  const removeArtifact = (deploymentId) => {
    setDeployedArtifacts(prev => prev.filter(a => a.deploymentId !== deploymentId));
  };

  const moveArtifact = (deploymentId, direction) => {
    setDeployedArtifacts(prev => {
      const idx = prev.findIndex(a => a.deploymentId === deploymentId);
      if (idx === -1) return prev;
      if (direction === 'left' && idx > 0) {
        const next = [...prev];
        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        return next;
      }
      if (direction === 'right' && idx < prev.length - 1) {
        const next = [...prev];
        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        return next;
      }
      return prev;
    });
  };

  const clearQueue = () => {
    setDeployedArtifacts([]);
  };

  return (
    <DeploymentContext.Provider value={{ 
      deployedArtifacts, 
      deployArtifact, 
      updateArtifact, 
      removeArtifact, 
      moveArtifact,
      clearQueue,
      deploymentCount: deployedArtifacts.length
    }}>
      {children}
    </DeploymentContext.Provider>
  );
}

export const useDeployment = () => {
  const context = useContext(DeploymentContext);
  if (!context) {
    throw new Error('useDeployment must be used within a DeploymentProvider');
  }
  return context;
};
