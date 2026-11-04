"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const center: [number, number] = [-49.2903, -25.4423];
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

type Position = [number, number];
type Area = { type: "Feature"; properties: Record<string, never>; geometry: { type: "Polygon"; coordinates: Position[][] } };

function circle(radiusKm: number): Area {
  const lat = (center[1] * Math.PI) / 180;
  const coordinates = Array.from({ length: 65 }, (_, i): Position => {
    const angle = (i / 64) * 2 * Math.PI;
    return [center[0] + (radiusKm * Math.cos(angle)) / (111.32 * Math.cos(lat)), center[1] + (radiusKm * Math.sin(angle)) / 110.57];
  });
  return { type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [coordinates] } };
}

function fit(map: maplibregl.Map, radiusKm: number, animate: boolean) {
  const bounds = new maplibregl.LngLatBounds();
  circle(radiusKm).geometry.coordinates[0].forEach((point) => bounds.extend(point));
  map.fitBounds(bounds, { padding: 28, duration: animate ? 300 : 0 });
}

export default function AreaMap({ radius }: { radius: number }) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const latest = useRef(radius);
  latest.current = radius;

  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({ container: container.current, style: "https://tiles.openfreemap.org/styles/positron", center, zoom: 11, interactive: false, attributionControl: { compact: true } });
    mapRef.current = map;
    map.on("load", () => {
      map.resize();
      map.addSource("area", { type: "geojson", data: circle(latest.current) });
      map.addLayer({ id: "area-fill", type: "fill", source: "area", paint: { "fill-color": "#12b886", "fill-opacity": 0.18 } });
      map.addLayer({ id: "area-line", type: "line", source: "area", paint: { "line-color": "#12b886", "line-width": 2 } });
      fit(map, latest.current, false);
    });
    const home = document.createElement("div");
    home.className = "geo-pin selected";
    home.textContent = "Você";
    home.style.width = "auto";
    home.style.padding = "0 10px";
    home.style.borderRadius = "999px";
    new maplibregl.Marker({ element: home }).setLngLat(center).addTo(map);
    return () => { mapRef.current = null; map.remove(); };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const source = map?.getSource("area") as maplibregl.GeoJSONSource | undefined;
    if (!map || !source) return;
    source.setData(circle(radius));
    fit(map, radius, true);
  }, [radius]);

  return <div ref={container} className="live-map" role="img" aria-label={`Mapa com raio de atendimento de ${radius} km`} />;
}
