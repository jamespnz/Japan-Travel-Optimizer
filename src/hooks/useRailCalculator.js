import { useState, useMemo } from 'react';

const PASS_PRICE = 50000;

export const useRailCalculator = (initialTrips = []) => {
  const [selectedTrips, setSelectedTrips] = useState(initialTrips);

  // Core calculation logic
  const stats = useMemo(() => {
    const totalIndividualCost = selectedTrips.reduce((acc, trip) => {
      const basePrice = trip.total || 0;
      const supplement = trip.isNozomi ? (trip.nozomi_supplement || 0) : 0;
      return acc + basePrice + supplement;
    }, 0);

    const savings = totalIndividualCost - PASS_PRICE;
    const isProfitable = totalIndividualCost >= PASS_PRICE;
    const progressPercent = Math.min((totalIndividualCost / PASS_PRICE) * 100, 100);

    return {
      totalIndividualCost,
      savings,
      isProfitable,
      progressPercent,
      passPrice: PASS_PRICE
    };
  }, [selectedTrips]);

  // Actions
  const toggleNozomi = (id) => {
    setSelectedTrips(prev => prev.map(t => 
      t.id === id ? { ...t, isNozomi: !t.isNozomi } : t
    ));
  };

  const removeTrip = (id) => {
    setSelectedTrips(prev => prev.filter(t => t.id !== id));
  };

  // Example fix inside useRailCalculator.js (or wherever addTrip is defined)
const addTrip = (route) => {
  const newTrip = {
    ...route,
    id: `${route.id}-${Date.now()}`, // Unique ID for key / state tracking
    total: route.fare || route.total || 0, // Ensures total numeric value exists
    isNozomi: false,
    nozomi_supplement: route.nozomi_supplement || 0,
  };
  setSelectedTrips((prev) => [...prev, newTrip]);
};

  // ADDED setSelectedTrips to the return object so App.jsx can clear the list
  return { selectedTrips, stats, toggleNozomi, removeTrip, addTrip, setSelectedTrips };
};