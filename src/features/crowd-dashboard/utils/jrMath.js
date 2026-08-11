// src/features/rail-optimizer/utils/jrMath.js

export const calculateJRValue = (itinerary) => {
  // Current 7-Day National Pass Price (approx 50,000 Yen)
  const PASS_PRICE = 50000; 
  
  // Summing up the individual ticket prices in the itinerary
  const totalIndividualCost = itinerary.reduce((sum, trip) => sum + trip.price, 0);
  
  return {
    isWorthIt: totalIndividualCost > PASS_PRICE,
    difference: totalIndividualCost - PASS_PRICE,
    total: totalIndividualCost
  };
};