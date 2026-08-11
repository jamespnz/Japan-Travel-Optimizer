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

  const addTrip = (newRoute) => {
    setSelectedTrips(prev => [...prev, { ...newRoute, id: Date.now(), isNozomi: false }]);
  };

  // ADDED setSelectedTrips to the return object so App.jsx can clear the list
  return { selectedTrips, stats, toggleNozomi, removeTrip, addTrip, setSelectedTrips };
};