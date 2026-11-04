"use client";

import { Bell, CalendarDays, ChevronRight, Heart, MapPin } from "lucide-react";
import { Avatar, BarberCard, Page } from "./components";
import { barbers, bookingStages, days, type Barber } from "./data";

export type BookingTab = "upcoming" | "history";

type BookingsProps = {
  tab: BookingTab; created: boolean; stage: number; barber: Barber; dayIndex: number; slot: string | null; address: string;
  onTab: (tab: BookingTab) => void; onDetails: () => void; onRebook: () => void; onExplore: () => void;
};

export function BookingsScreen({ tab, created, stage, barber, dayIndex, slot, address, onTab, onDetails, onRebook, onExplore }: BookingsProps) {
  const visible = created && (tab === "upcoming" ? stage < 5 : stage === 5);
  const history = tab === "history";
  return <Page title="Meus agendamentos" subtitle="Acompanhe seus atendimentos demonstrativos.">
    <div className="booking-tabs" role="group" aria-label="Tipo de agendamento"><button type="button" className={tab === "upcoming" ? "selected" : ""} aria-pressed={tab === "upcoming"} onClick={() => onTab("upcoming")}>Próximos</button><button type="button" className={history ? "selected" : ""} aria-pressed={history} onClick={() => onTab("history")}>Histórico</button></div>
    {visible ? <article className="booking-card"><Avatar barber={barber}/><div><span className="status-pill">{bookingStages[stage - 1]}</span><h2>{barber.name}</h2><p><CalendarDays size={14}/>{days[dayIndex]} às {slot}</p><p><MapPin size={14}/>{address}</p><button onClick={onDetails}>Ver detalhes <ChevronRight size={16}/></button>{history && <button onClick={onRebook}>Agendar novamente <ChevronRight size={16}/></button>}</div></article>
      : <div className="empty"><CalendarDays/><b>{history ? "Nenhum atendimento no histórico" : "Nenhum agendamento próximo"}</b><p>{history ? "Atendimentos concluídos na demonstração aparecerão aqui." : "Envie uma solicitação para ela aparecer aqui."}</p><button className="secondary" onClick={history ? () => onTab("upcoming") : onExplore}>{history ? "Ver próximos" : "Explorar barbeiros"}</button></div>}
  </Page>;
}

export function FavoritesScreen({ favorites, onFavorite, onOpen, onExplore }: { favorites: number[]; onFavorite: (id: number) => void; onOpen: (barber: Barber) => void; onExplore: () => void }) {
  return <Page title="Favoritos" subtitle="Profissionais salvos para facilitar seu próximo agendamento.">
    {favorites.length ? <div className="barber-grid">{barbers.filter((barber) => favorites.includes(barber.id)).map((barber) => <BarberCard key={barber.id} barber={barber} favorite onFavorite={() => onFavorite(barber.id)} onOpen={() => onOpen(barber)} />)}</div>
      : <div className="empty"><Heart/><b>Nenhum favorito ainda</b><p>Salve barbeiros para encontrá-los mais rápido.</p><button className="secondary" onClick={onExplore}>Explorar barbeiros</button></div>}
  </Page>;
}

export function CustomerProfileScreen({ onEdit, onBookings, onFavorites, onAddresses, onHelp }: { onEdit: () => void; onBookings: () => void; onFavorites: () => void; onAddresses: () => void; onHelp: () => void }) {
  return <Page title="Meu perfil" subtitle="Dados demonstrativos, sem autenticação real.">
    <div className="profile-settings"><div className="customer-avatar large">EO</div><div><h2>Emerson Oliveira</h2><p>emerson@exemplo.com · (41) 99999-0000</p></div><button className="secondary" onClick={onEdit}>Editar</button></div>
    <div className="settings-list"><button onClick={onBookings}><CalendarDays/>Meus agendamentos <ChevronRight/></button><button onClick={onFavorites}><Heart/>Favoritos <ChevronRight/></button><button onClick={onAddresses}><MapPin/>Meus endereços <ChevronRight/></button><button onClick={onHelp}><Bell/>Ajuda e suporte <ChevronRight/></button></div>
  </Page>;
}
