"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export function OperationMap({ telemetry }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!telemetry?.length || !containerRef.current) return;

    let cancelled = false;

    import("leaflet").then((leafletModule) => {
      if (cancelled) return;
      const L = leafletModule.default;

      const points = telemetry.map((t) => [t.latitude, t.longitude]);
      const latest = points[points.length - 1];

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current).setView(latest, 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
        }).addTo(mapRef.current);
        mapRef.current._nkemLayer = L.layerGroup().addTo(mapRef.current);
      }

      mapRef.current._nkemLayer.clearLayers();
      if (points.length > 1) {
        L.polyline(points, { color: "#1e5aa8", weight: 3 }).addTo(mapRef.current._nkemLayer);
      }
      L.marker(latest).addTo(mapRef.current._nkemLayer);
      mapRef.current.setView(latest, mapRef.current.getZoom());
    });

    return () => {
      cancelled = true;
    };
  }, [telemetry]);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  if (!telemetry?.length) return null;

  const last = telemetry[telemetry.length - 1];

  return (
    <div className="space-y-1">
      <div ref={containerRef} className="h-64 w-full overflow-hidden rounded-lg border border-border" />
      <p className="text-xs text-muted-foreground">
        Last position: {new Date(last.recordedAt).toLocaleString("en-GB")}
        {last.altitude !== null ? ` · ${last.altitude}m alt` : ""}
        {last.speed !== null ? ` · ${last.speed}m/s` : ""}
      </p>
    </div>
  );
}
