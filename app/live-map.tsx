"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Barber } from "./data";

// Coordenadas aproximadas dos bairros de Curitiba (dados demonstrativos).
const neighborhoodCoords: Record<string, [number, number]> = {
  "Batel": [-49.2903, -25.4423],
  "Água Verde": [-49.2755, -25.4558],
  "Centro": [-49.2713, -25.4284],
  "Bigorrilho": [-49.2957, -25.4263],
  "Portão": [-49.2917, -25.4768],
  "Cabral": [-49.2575, -25.4093],
  "Juvevê": [-49.2644, -25.4132],
  "Santa Felicidade": [-49.3375, -25.4011],
  "Rebouças": [-49.2619, -25.4413],
  "Mercês": [-49.2845, -25.4189],
};
const center: [number, number] = [-49.2803, -25.4323];
maplibregl.setWorkerUrl("/maplibre-gl-worker.mjs");

export default function LiveMap({ barbers, activeId, onPick }: { barbers: Barber[]; activeId?: number; onPick: (barber: Barber) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const markers = useRef(new Map<number, HTMLButtonElement>());
  const pick = useRef(onPick);
  pick.current = onPick;

  useEffect(() => {
    if (!container.current) return;
    const map = new maplibregl.Map({ container: container.current, style: "https://tiles.openfreemap.org/styles/positron", center, zoom: 11.6, attributionControl: { compact: true } });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    const current = markers.current;
    const bounds = new maplibregl.LngLatBounds();
    barbers.forEach((barber) => {
      const coords = neighborhoodCoords[barber.neighborhood];
      if (!coords) return;
      bounds.extend(coords);
      const el = document.createElement("button");
      el.type = "button";
      el.className = "geo-pin";
      el.textContent = barber.initials;
      el.setAttribute("aria-label", `Selecionar ${barber.name}`);
      el.addEventListener("click", () => pick.current(barber));
      new maplibregl.Marker({ element: el }).setLngLat(coords).addTo(map);
      current.set(barber.id, el);
    });
    if (!bounds.isEmpty()) map.once("load", () => { map.resize(); map.fitBounds(bounds, { padding: { top: 70, left: 36, right: 36, bottom: 210 }, maxZoom: 13, duration: 0 }); });
    return () => { current.clear(); map.remove(); };
  }, [barbers]);

  useEffect(() => {
    markers.current.forEach((el, id) => {
      el.classList.toggle("selected", id === activeId);
      el.setAttribute("aria-pressed", String(id === activeId));
    });
  }, [activeId, barbers]);

  return <div ref={container} className="live-map" />;
}
