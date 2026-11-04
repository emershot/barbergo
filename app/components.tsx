"use client";

import { useRef, useState } from "react";
import { ArrowLeft, CalendarDays, Check, ChevronRight, Clock3, Heart, MapPin, Star } from "lucide-react";
import dynamic from "next/dynamic";
import type { Barber } from "./data";

const LiveMap = dynamic(() => import("./live-map"), { ssr: false });

const skinTones = ["#e8b98f", "#c98f68", "#f0c9a5", "#a8714e", "#d9a47c"];
const hairColors = ["#1c1a19", "#3b2a20", "#5a4030", "#16181c"];

export function Avatar({ barber, size = "md" }: { barber: Barber; size?: "sm" | "md" | "lg" }) {
  const skin = skinTones[barber.id % skinTones.length];
  const hair = hairColors[(barber.id * 3) % hairColors.length];
  const style = barber.id % 3;
  const beard = barber.id % 2 === 0;
  return <div className={`avatar ${size}`} style={{ background: barber.color }} role="img" aria-label={`Avatar demonstrativo de ${barber.name}`}>
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <path d="M8 64c2-14 12-20 24-20s22 6 24 20z" fill="#17191d"/>
      <rect x="27" y="36" width="10" height="10" rx="4" fill={skin}/>
      <ellipse cx="32" cy="27" rx="12" ry="14" fill={skin}/>
      {beard && <path d="M20 29c0 10 6 15 12 15s12-5 12-15c-3 5-7 6-12 6s-9-1-12-6z" fill={hair} opacity=".9"/>}
      {style === 0 && <path d="M19 25c-1-11 6-17 13-17s14 6 13 17c-3-5-7-8-13-8s-10 3-13 8z" fill={hair}/>}
      {style === 1 && <path d="M19 26c-2-13 6-20 15-18 8 1 12 8 11 18-2-6-5-9-9-9-6 0-12 2-17 9z" fill={hair}/>}
      {style === 2 && <path d="M20 24c0-9 5-13 12-13s12 4 12 13c-3-3-6-5-12-5s-9 2-12 5z" fill={hair}/>}
      <circle cx="27" cy="28" r="1.3" fill="#17191d"/>
      <circle cx="37" cy="28" r="1.3" fill="#17191d"/>
    </svg>
  </div>;
}

export function Rating({ barber }: { barber: Barber }) { return <span className="rating"><Star size={14} fill="currentColor" /> {barber.rating.toFixed(1)} <span>({barber.reviews})</span></span>; }

export function Page({ title, subtitle, back, step, children }: { title?: string; subtitle?: string; back?: () => void; step?: number; children: React.ReactNode }) { return <section className="page"><div className="page-top">{back && <button className="back" onClick={back} aria-label="Voltar"><ArrowLeft/></button>}<div>{title && <h1>{title}</h1>}{subtitle && <p>{subtitle}</p>}</div></div>{step && <ol className="stepper" aria-label={`Etapa ${step} de 3`}>{["Horário", "Revisão", "Acompanhar"].map((label, i) => <li key={label} className={i + 1 < step ? "done" : i + 1 === step ? "current" : ""} aria-current={i + 1 === step ? "step" : undefined}><span>{i + 1 < step ? <Check size={12}/> : i + 1}</span>{label}</li>)}</ol>}{children}</section>; }

export function BarberCard({ barber, favorite, onFavorite, onOpen }: { barber: Barber; favorite: boolean; onFavorite: () => void; onOpen: () => void }) { return <article className="barber-card"><Avatar barber={barber}/><div className="barber-info"><div><h3 aria-level={2}>{barber.name}</h3><button className={`heart small ${favorite ? "liked" : ""}`} onClick={onFavorite} aria-label="Favoritar" aria-pressed={favorite}><Heart size={18} fill={favorite ? "currentColor" : "none"}/></button></div><Rating barber={barber}/><p><MapPin size={14}/>{barber.distance} · {barber.neighborhood} · ~{Math.max(8, Math.round(Number(barber.distance.replace(",", ".").replace(/[^\d.]/g, "")) * 6))} min</p><p className="next"><Clock3 size={14}/> {barber.next}</p><span className="verified"><Check size={12}/> Verificado (demo)</span></div><div className="card-bottom"><b>R$ {barber.price}</b><button onClick={onOpen}>Ver perfil <ChevronRight size={16}/></button></div></article>; }

export function MapDemo({ barbers, onSelect, onOpenProfile }: { barbers: Barber[]; onSelect: (barber: Barber) => void; onOpenProfile: () => void }) {
  const [activeBarber, setActiveBarber] = useState<Barber | null>(null);
  const [expanded, setExpanded] = useState(true);
  const dragStart = useRef<number | null>(null);
  const swiped = useRef(false);

  const selectBarber = (barber: Barber) => {
    setActiveBarber(barber);
    setExpanded(true);
    onSelect(barber);
  };

  const step = (delta: number) => {
    const index = barbers.findIndex((item) => item.id === activeBarber?.id);
    selectBarber(barbers[(index + delta + barbers.length) % barbers.length]);
  };

  const endDrag = (clientY: number) => {
    if (dragStart.current === null) return;
    const delta = clientY - dragStart.current;
    dragStart.current = null;
    if (Math.abs(delta) <= 24) return;
    swiped.current = true;
    setExpanded(delta < 0);
  };

  const onGripClick = () => {
    if (swiped.current) { swiped.current = false; return; }
    setExpanded((value) => !value);
  };

  return <div className="map-demo" role="region" aria-label="Mapa demonstrativo de barbeiros">
    <div className="map-streets"/>
    <LiveMap barbers={barbers} activeId={activeBarber?.id} onPick={selectBarber}/>
    <span className="map-address">Curitiba · posições demonstrativas</span>
    {activeBarber ? <article className={`map-preview ${expanded ? "" : "collapsed"}`} aria-live="polite">
      <button type="button" className="sheet-grip-btn" aria-expanded={expanded} aria-label={expanded ? "Recolher detalhes" : "Expandir detalhes"} onClick={onGripClick} onPointerDown={(event) => { dragStart.current = event.clientY; swiped.current = false; }} onPointerUp={(event) => endDrag(event.clientY)} onPointerCancel={() => { dragStart.current = null; }}><span className="sheet-grip" aria-hidden="true"/></button>
      <div className="map-preview-row">
        <Avatar barber={activeBarber} size="sm"/>
        <div className="map-preview-info"><b>{activeBarber.name}</b><Rating barber={activeBarber}/><span><MapPin size={13}/>{activeBarber.distance} · {activeBarber.neighborhood}</span></div>
        <b className="map-preview-price">R$ {activeBarber.price}</b>
      </div>
      {expanded && <>
        <div className="map-preview-meta"><span><Clock3 size={13}/> {activeBarber.next}</span>{activeBarber.tags.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="map-preview-actions">
          <button type="button" className="secondary" onClick={() => step(-1)} aria-label="Barbeiro anterior"><ArrowLeft size={16}/></button>
          <button type="button" className="primary" onClick={onOpenProfile}>Ver perfil</button>
          <button type="button" className="secondary" onClick={() => step(1)} aria-label="Próximo barbeiro"><ChevronRight size={16}/></button>
        </div>
      </>}
    </article> : <div className="map-hint">Toque em um marcador para ver o barbeiro</div>}
  </div>;
}

export function Metric({ value, label }: { value: string; label: string }) { return <div className="metric"><b>{value}</b><span>{label}</span></div>; }

export function Request({ name, place, time, status, onAccept, onDecline }: { name: string; place: string; time: string; status: "pending" | "accepted" | "declined"; onAccept: () => void; onDecline: () => void }) { return <article className="request"><div className="customer-avatar">{name.split(" ").map((p) => p[0]).join("")}</div><div><h3 aria-level={2}>{name}</h3><p><MapPin size={14}/>{place}</p><p><CalendarDays size={14}/>{time} · Corte masculino</p>{status !== "pending" && <span className={`request-status ${status}`}>{status === "accepted" ? "Aceita" : "Recusada"}</span>}</div><div className="request-actions">{status === "pending" ? <><button onClick={onDecline}>Recusar</button><button className="primary" onClick={onAccept}>Aceitar</button></> : <span className="request-resolution">{status === "accepted" ? "Atendimento confirmado" : "Solicitação encerrada"}</span>}</div></article>; }
