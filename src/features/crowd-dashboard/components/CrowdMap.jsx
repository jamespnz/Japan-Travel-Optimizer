import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import kyotoData from "../data/kyoto-spots.json";
import { getVibeStatus } from "../utils/getVibeStyles";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const CrowdMap = ({ selectedTrips = [], cityCoords = {} }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [activeSpot, setActiveSpot] = useState(null);

  // --- ANIMATION ENGINE ---
  const animateLine = (startCoords, endCoords, onComplete) => {
    // Added onComplete
    const duration = 40;
    let frame = 0;

    const frameLoop = () => {
      if (selectedTrips.length === 0) return;

      frame++;
      const progress = frame / duration;
      const currentLng =
        startCoords[0] + (endCoords[0] - startCoords[0]) * progress;
      const currentLat =
        startCoords[1] + (endCoords[1] - startCoords[1]) * progress;

      const source = map.current.getSource("route-line");
      if (source) {
        const currentData = source._data;
        const lastIdx = currentData.features.length - 1;
        if (currentData.features[lastIdx]) {
          currentData.features[lastIdx].geometry.coordinates = [
            startCoords,
            [currentLng, currentLat],
          ];
          source.setData(currentData);
        }
      }

      if (frame < duration) {
        requestAnimationFrame(frameLoop);
      } else {
        // Animation finished! Run the callback to show the marker
        if (onComplete) onComplete();
      }
    };
    requestAnimationFrame(frameLoop);
  };

  // EFFECT: Handle trip changes and trigger animations
  useEffect(() => {
    // 1. Guards: Map must be ready and source must exist
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource("route-line");
    if (!source) return;

    // 2. Handle Empty State (Clear All)
    if (selectedTrips.length === 0) {
      source.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    // 3. Logic: If a new trip was added, target the last leg
    const lastTrip = selectedTrips[selectedTrips.length - 1];
    const start = cityCoords[lastTrip.origin];
    const end = cityCoords[lastTrip.destination];

    if (start && end) {
      // AUTO-FOCUS: Calculate bounds to include both cities
      const bounds = new mapboxgl.LngLatBounds().extend(start).extend(end);

      map.current.fitBounds(bounds, {
        padding: 100,
        duration: 1500,
        essential: true,
      });

      // BUILD DATA: Previous trips are static, new trip starts at [start, start]
      const features = selectedTrips.map((trip, idx) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates:
            idx === selectedTrips.length - 1
              ? [start, start]
              : [cityCoords[trip.origin], cityCoords[trip.destination]],
        },
      }));

      source.setData({ type: "FeatureCollection", features });

      // Inside the animateLine call within useEffect:
      setTimeout(() => {
        animateLine(start, end, () => {
          // This code runs ONLY when the line reaches the destination
          const labelSource = map.current.getSource("city-labels");
          if (labelSource) {
            const labelFeatures = selectedTrips.map((trip) => ({
              type: "Feature",
              properties: { cityName: trip.destination.toUpperCase() },
              geometry: {
                type: "Point",
                coordinates: cityCoords[trip.destination],
              },
            }));
            labelSource.setData({
              type: "FeatureCollection",
              features: labelFeatures,
            });
          }
        });
      }, 500);
    }
  }, [selectedTrips, cityCoords]); // Corrected closing brackets

  // EFFECT: Handle trip changes and trigger animations
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;

    const source = map.current.getSource("route-line");
    const labelSource = map.current.getSource("city-labels");
    if (!source || !labelSource) return;

    // 1. Handle Empty State (Clear All) - Now clears labels too
    if (selectedTrips.length === 0) {
      source.setData({ type: "FeatureCollection", features: [] });
      labelSource.setData({ type: "FeatureCollection", features: [] });
      return;
    }

    const lastTrip = selectedTrips[selectedTrips.length - 1];
    const start = cityCoords[lastTrip.origin];
    const end = cityCoords[lastTrip.destination];

    if (start && end) {
      // AUTO-FOCUS
      const bounds = new mapboxgl.LngLatBounds().extend(start).extend(end);
      map.current.fitBounds(bounds, {
        padding: 100,
        duration: 1500,
        essential: true,
      });

      // Build initial lines (static previous legs + new leg at 0 progress)
      const features = selectedTrips.map((trip, idx) => ({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates:
            idx === selectedTrips.length - 1
              ? [start, start]
              : [cityCoords[trip.origin], cityCoords[trip.destination]],
        },
      }));

      source.setData({ type: "FeatureCollection", features });

      // Trigger animation and then update labels
      setTimeout(() => {
        animateLine(start, end, () => {
          const updatedLabels = selectedTrips.map((trip) => ({
            type: "Feature",
            properties: { cityName: trip.destination.toUpperCase() },
            geometry: {
              type: "Point",
              coordinates: cityCoords[trip.destination],
            },
          }));
          labelSource.setData({
            type: "FeatureCollection",
            features: updatedLabels,
          });
        });
      }, 500);
    }
  }, [selectedTrips, cityCoords]);

  // ON LOAD: Cleaned up duplicates
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [137.5, 36.0],
      zoom: 1, // Start very far out (Space view)
      pitch: 45, // Tilted angle for a 3D effect
      antialias: true,
    });

    map.current.on("load", () => {
      // --- 0. SPACE-TO-STREET ANIMATION ---
      map.current.flyTo({
        center: [138.2529, 36.2048], // Final Japan center
        zoom: 5.5, // Final usable zoom
        pitch: 0, // Flatten the map back out
        speed: 0.8, // Slower is more cinematic
        curve: 1, // Makes the flight path feel natural
        essential: true, // Animation can't be interrupted by user
      });

      map.current.resize();

      // --- SETUP SOURCES ---
      map.current.addSource("city-labels", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.current.addSource("route-line", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });
      map.current.addSource("crowds", { type: "geojson", data: kyotoData });

      // --- SETUP LAYERS (Bottom to Top) ---

      // 1. Heatmap
      map.current.addLayer({
        id: "crowd-heat",
        type: "heatmap",
        source: "crowds",
        paint: {
          "heatmap-weight": ["get", "density"],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(0, 255, 0, 0)",
            0.1,
            "#10b981",
            0.4,
            "#f59e0b",
            0.7,
            "#ef4444",
          ],
          "heatmap-radius": 35,
          "heatmap-opacity": 0.8,
        },
      });

      // 2. Rail Lines
      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route-line",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#6366f1",
          "line-width": 3,
          "line-dasharray": [2, 1],
          "line-opacity": 0.9,
          "line-blur": 1,
        },
      });

      // 3. City Labels
      map.current.addLayer({
        id: "city-labels",
        type: "symbol",
        source: "city-labels",
        layout: {
          "text-field": ["get", "cityName"],
          "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
          "text-offset": [0, 1.5],
          "text-anchor": "top",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#0f172a",
          "text-halo-width": 2,
        },
      });

      // 4. Interaction Points
      map.current.addLayer({
        id: "crowd-points",
        type: "circle",
        source: "crowds",
        paint: { "circle-radius": 20, "circle-opacity": 0 },
      });

      // (Rest of your event listeners here...)
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div className="w-full h-screen relative bg-red-900 overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0 z-0" />
      {/* branding and sidebar JSX from your existing file goes here... */}
    </div>
  );
};

export default CrowdMap;
