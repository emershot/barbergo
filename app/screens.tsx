"use client";

import { useState } from "react";
import { Drawer } from "vaul";
import { DayPicker } from "react-day-picker";
import { ptBR } from "react-day-picker/locale";
import "react-day-picker/style.css";
import { CalendarDays, Check, Clock3, Heart, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import dynamic from "next/dynamic";
import { Avatar, BarberCard, MapDemo, Page, Rating } from "./components";
import { SERVICE_RADIUS_MAX, SERVICE_RADIUS_MIN, bookingStages, days, demoToday, maxBookingDays, slots, type Barber } from "./data";

const AreaMap = dynamic(() => import("./area-map"), { ssr: false });

type DiscoverProps = {
  address: string; barbers: Barber[]; favorites: number[]; loading: boolean; view: "list" | "map"; sortBy: "distance" | "rating";
  filterOpen: boolean; availableToday: boolean; maxDistance: number;
  onBack: () => void; onEditLocation: () => void; onFilterOpen: (open: boolean) => void; onView: (view: "list" | "map") => void;
  onSort: (sort: "distance" | "rating") => void; onAvailableToday: (value: boolean) => void; onMaxDistance: (value: number) => void;
  onFavorite: (id: number) => void; onSelect: (barber: Barber) => void; onOpenProfile: (barber?: Barber) => void;
};

export function DiscoverScreen(p: DiscoverProps) {
  return <Page title="Barbeiros perto de você" back={p.onBack} subtitle={p.address}>
    <div className="discover-tools"><button className="location-chip" onClick={p.onEditLocation}><MapPin size={16}/>{p.address}</button><button className="filter-btn" onClick={() => p.onFilterOpen(true)}><SlidersHorizontal size={18}/>Filtros</button></div>
    <div className="section-head"><p><b>{p.barbers.length} barbeiros</b> atendem esta região</p><div className="segment" role="group" aria-label="Visualização dos profissionais"><button type="button" className={p.view === "list" ? "selected" : ""} aria-pressed={p.view === "list"} onClick={() => p.onView("list")}>Lista</button><button type="button" className={p.view === "map" ? "selected" : ""} aria-pressed={p.view === "map"} onClick={() => p.onView("map")}>Mapa</button></div></div>
    <div className="sort-row" role="group" aria-label="Ordenação"><span>Ordenar por</span><button type="button" className={p.sortBy === "distance" ? "selected" : ""} aria-pressed={p.sortBy === "distance"} onClick={() => p.onSort("distance")}>Mais próximos</button><button type="button" className={p.sortBy === "rating" ? "selected" : ""} aria-pressed={p.sortBy === "rating"} onClick={() => p.onSort("rating")}>Melhor avaliados</button></div>
    {p.loading ? <div className="barber-grid" aria-label="Carregando barbeiros">{[1, 2, 3, 4].map((item) => <div className="skeleton-card" key={item}><i/><span/><span/><b/></div>)}</div>
      : p.view === "map" ? <MapDemo barbers={p.barbers} onSelect={p.onSelect} onOpenProfile={() => p.onOpenProfile()} />
      : p.barbers.length ? <div className="barber-grid">{p.barbers.map((barber) => <BarberCard key={barber.id} barber={barber} favorite={p.favorites.includes(barber.id)} onFavorite={() => p.onFavorite(barber.id)} onOpen={() => p.onOpenProfile(barber)} />)}</div>
      : <div className="empty"><Search/><b>Nenhum barbeiro encontrado</b><p>Aumente o raio ou remova os filtros para ver mais profissionais.</p><button className="secondary" onClick={() => { p.onAvailableToday(false); p.onMaxDistance(15); }}>Limpar filtros</button></div>}
    <Drawer.Root open={p.filterOpen} onOpenChange={p.onFilterOpen}><Drawer.Portal><Drawer.Overlay className="sheet-backdrop" /><Drawer.Content className="filter-sheet" aria-describedby={undefined}><Drawer.Handle className="sheet-grip" /><div className="sheet-title"><Drawer.Title asChild><h2>Filtros</h2></Drawer.Title><button onClick={() => p.onFilterOpen(false)} aria-label="Fechar filtros"><X/></button></div><label className="check-row"><input type="checkbox" checked={p.availableToday} onChange={(e) => p.onAvailableToday(e.target.checked)}/> Disponíveis hoje</label><label>Raio máximo <b>{p.maxDistance} km</b><input type="range" min="1" max="15" value={p.maxDistance} onChange={(event) => p.onMaxDistance(Number(event.target.value))}/></label><button className="primary wide" onClick={() => p.onFilterOpen(false)}>Ver {p.barbers.length} resultados</button><button className="text-button" onClick={() => { p.onAvailableToday(false); p.onMaxDistance(15); }}>Limpar filtros</button></Drawer.Content></Drawer.Portal></Drawer.Root>
  </Page>;
}

type ProfileProps = { barber: Barber; favorite: boolean; onBack: () => void; onFavorite: () => void; onSchedule: () => void };

export function ProfileScreen({ barber, favorite, onBack, onFavorite, onSchedule }: ProfileProps) {
  return <Page back={onBack}>
    <section className="profile-hero"><Avatar barber={barber} size="lg"/><div><p className="eyebrow">BARBEIRO VERIFICADO • DEMO</p><h1>{barber.name}</h1><Rating barber={barber}/><p><MapPin size={15}/>{barber.distance} de você · {barber.neighborhood}</p></div><button className={`heart ${favorite ? "liked" : ""}`} onClick={onFavorite} aria-label="Favoritar" aria-pressed={favorite}><Heart fill={favorite ? "currentColor" : "none"}/></button></section>
    <div className="profile-columns"><div><section className="info-card"><h2>Sobre</h2><p>{barber.bio}</p><div className="tags">{barber.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section><section className="info-card"><h2>Portfólio</h2><div className="portfolio"><i>Degradê</i><i>Social</i><i>Barba</i></div></section><section className="info-card"><h2>Avaliações demonstrativas</h2><div className="rating-summary"><strong>{barber.rating.toFixed(1).replace(".", ",")}</strong><div>{[5, 4, 3].map((n, i) => <p key={n}><span>{n}★</span><i><em style={{ width: `${[82, 14, 4][i]}%` }}/></i></p>)}</div></div>{[["Marcos", "há 2 semanas", "Pontual, cuidadoso e o acabamento ficou excelente."], ["Felipe", "há 1 mês", "Atendeu no meu condomínio sem nenhum transtorno. Voltarei a agendar."], ["Daniel", "há 2 meses", "Ótimo degradê e conversa agradável."]].map(([who, when, text]) => <blockquote key={who}>“{text}” <b>— {who}, Curitiba · {when}</b></blockquote>)}</section></div><div className="booking-panel"><p>Próximo horário</p><h3>{barber.next}</h3><span>corte masculino · R$ {barber.price}</span><button className="primary wide" onClick={onSchedule}>Agendar corte</button><small>Solicitação simulada, sem pagamento.</small></div></div>
  </Page>;
}

type ScheduleProps = { barber: Barber; selectedDay: number; selectedSlot: string | null; onBack: () => void; onDay: (index: number) => void; onSlot: (slot: string) => void; onContinue: () => void };

function MoreDates({ selectedDay, onDay }: { selectedDay: number; onDay: (index: number) => void }) {
  const [open, setOpen] = useState(false);
  const base = new Date(demoToday.getFullYear(), demoToday.getMonth(), demoToday.getDate());
  const end = new Date(base.getFullYear(), base.getMonth(), base.getDate() + maxBookingDays - 1);
  const selected = new Date(base.getFullYear(), base.getMonth(), base.getDate() + selectedDay);
  const far = selectedDay > 4;
  return <Drawer.Root open={open} onOpenChange={setOpen}><Drawer.Trigger asChild><button type="button" className={far ? "selected more-dates" : "more-dates"}><CalendarDays size={18}/><span>{far ? days[selectedDay] : "Mais datas"}</span></button></Drawer.Trigger><Drawer.Portal><Drawer.Overlay className="sheet-backdrop"/><Drawer.Content className="filter-sheet date-sheet" aria-describedby={undefined}><Drawer.Handle className="sheet-grip"/><div className="sheet-title"><Drawer.Title asChild><h2>Escolha a data</h2></Drawer.Title><button onClick={() => setOpen(false)} aria-label="Fechar calendário"><X/></button></div><DayPicker mode="single" locale={ptBR} defaultMonth={selected} selected={selected} disabled={{ before: base, after: end }} startMonth={base} endMonth={end} onSelect={(date) => { if (!date) return; onDay(Math.round((date.getTime() - base.getTime()) / 86400000)); setOpen(false); }}/></Drawer.Content></Drawer.Portal></Drawer.Root>;
}

export function ScheduleScreen({ barber, selectedDay, selectedSlot, onBack, onDay, onSlot, onContinue }: ScheduleProps) {
  return <Page step={1} title="Escolha seu horário" back={onBack} subtitle={`Com ${barber.name}`}>
    <div className="mini-barber"><Avatar barber={barber}/><div><b>{barber.name}</b><span>Corte masculino · R$ {barber.price}</span></div></div><div className="day-tabs">{days.slice(0, 5).map((day, index) => <button key={day} className={selectedDay === index ? "selected" : ""} onClick={() => onDay(index)}><small>{index === 0 ? "TER" : day.slice(0,3).toUpperCase()}</small><b>{index === 0 ? "4" : day.slice(-1)}</b><span>{index === 0 ? "Hoje" : day.split(", ")[0]}</span></button>)}<MoreDates selectedDay={selectedDay} onDay={onDay}/></div>
    <h3 aria-level={2}>Horários disponíveis</h3>{selectedDay === 3 ? <div className="empty"><CalendarDays/><b>Sem horários neste dia</b><p>Escolha outra data para continuar.</p></div> : <div className="slots">{slots.map((slot, index) => <button type="button" key={slot} disabled={index === 2 && selectedDay === 0} className={selectedSlot === slot ? "selected" : ""} aria-pressed={selectedSlot === slot} onClick={() => onSlot(slot)}>{slot}</button>)}</div>}
    <button className="primary sticky-action" disabled={!selectedSlot} onClick={onContinue}>Continuar {selectedSlot && `· ${selectedSlot}`}</button>
  </Page>;
}

type ReviewProps = { barber: Barber; selectedDay: number; selectedSlot: string | null; address: string; onBack: () => void; onSubmit: () => void };

export function ReviewScreen({ barber, selectedDay, selectedSlot, address, onBack, onSubmit }: ReviewProps) {
  return <Page step={2} title="Revise sua solicitação" back={onBack}>
    <div className="review-card"><Avatar barber={barber}/><div><b>{barber.name}</b><Rating barber={barber}/></div></div>
    <dl className="summary"><div><dt>Serviço</dt><dd>Corte masculino · ~45 min</dd></div><div><dt>Quando</dt><dd>{days[selectedDay]} às {selectedSlot}</dd></div><div><dt>Onde</dt><dd>{address}</dd></div><div><dt>Valor demonstrativo</dt><dd>R$ {barber.price}</dd></div></dl>
    <label className="notes">Observação para o barbeiro<textarea placeholder="Ex.: tocar o interfone 42" /></label>
    <button className="primary sticky-action" onClick={onSubmit}>Solicitar agendamento</button>
  </Page>;
}

type TrackingProps = { barber: Barber; stage: number; selectedDay: number; selectedSlot: string | null; address: string; onBack: () => void; onAdvance: () => void; onSupport: () => void };

export function TrackingScreen({ barber, stage, selectedDay, selectedSlot, address, onBack, onAdvance, onSupport }: TrackingProps) {
  return <Page title={stage === 5 ? "Atendimento concluído" : "Acompanhe sua solicitação"} back={onBack} subtitle="Etapas e horários demonstrativos.">
    <div className="booking-card tracking-summary"><Avatar barber={barber}/><div><span className="status-pill" aria-live="polite">{bookingStages[stage - 1]}</span><h2>{barber.name}</h2><p><CalendarDays size={14}/>{days[selectedDay]} às {selectedSlot}</p><p><MapPin size={14}/>{address}</p><p>Corte masculino · R$ {barber.price}</p></div></div>
    <div className="timeline">{bookingStages.map((name, index) => {
      const stageNumber = index + 1;
      const complete = stage > stageNumber;
      const current = stage === stageNumber;
      return <div key={name} className={complete ? "done" : current ? "current" : ""}><i>{complete ? <Check/> : current ? <Clock3/> : stageNumber}</i><b>{name}</b>{current && <span>Etapa atual · demonstração</span>}</div>;
    })}</div>
    {stage < bookingStages.length ? <button className="primary wide" onClick={onAdvance}>Simular próxima etapa</button> : <p className="center-text">Este atendimento foi concluído na demonstração.</p>}
    <button className="secondary wide tracking-support" onClick={onSupport}>Precisa de ajuda?</button>
  </Page>;
}

type AreaProps = { radius: number; onBack: () => void; onRadius: (value: number) => void; onSave: () => void };

export function ServiceAreaScreen({ radius, onBack, onRadius, onSave }: AreaProps) {
  return <Page title="Minha área de atendimento" back={onBack} subtitle="Defina até onde você quer receber solicitações.">
    <div className="service-map"><AreaMap radius={radius}/><span className="map-label">Batel, Curitiba · raio de {radius} km</span></div>
    <div className="radius-control"><div><h3>Raio de cobertura</h3><p>Você poderá receber solicitações dentro desta área.</p></div><label className="radius-value">Raio em quilômetros<input aria-label="Raio em quilômetros" type="number" inputMode="numeric" min={SERVICE_RADIUS_MIN} max={SERVICE_RADIUS_MAX} value={radius} onChange={(event) => { const next = Number(event.target.value); if (Number.isFinite(next) && next >= SERVICE_RADIUS_MIN && next <= SERVICE_RADIUS_MAX) onRadius(next); }}/></label><input aria-label="Ajustar raio de atendimento" type="range" min={SERVICE_RADIUS_MIN} max={SERVICE_RADIUS_MAX} value={radius} onChange={(event) => onRadius(Number(event.target.value))}/><div className="range-label"><span>{SERVICE_RADIUS_MIN} km</span><span>{SERVICE_RADIUS_MAX} km</span></div></div>
    <button className="primary sticky-action" onClick={onSave}>Salvar área de atendimento</button>
  </Page>;
}
