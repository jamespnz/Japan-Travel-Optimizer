// Ensure calculation sums up trip.total (or trip.fare)
export function calculateStats(trips) {
  const totalIndividualCost = trips.reduce((sum, trip) => {
    const base = trip.total || trip.fare || 0;
    const supp = trip.isNozomi ? (trip.nozomi_supplement || 0) : 0;
    return sum + base + supp;
  }, 0);

  const PASS_COST = 50000;
  const progressPercent = Math.min(100, Math.round((totalIndividualCost / PASS_COST) * 100));
  const isProfitable = totalIndividualCost >= PASS_COST;
  const savings = totalIndividualCost - PASS_COST;

  return {
    totalIndividualCost,
    progressPercent,
    isProfitable,
    savings,
  };
}