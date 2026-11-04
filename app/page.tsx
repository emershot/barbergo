"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, CalendarDays, Check, ChevronRight, Heart, Home, MapPin, Navigation, Search, Star, UserRound, X
} from "lucide-react";

import { Avatar, Page } from "./components";
import { AdminScreen, AgendaScreen, BarberDashboard, BarberProfileScreen, PortfolioScreen, RequestsScreen, type AdminSection } from "./barber-screens";
import { BookingsScreen, CustomerProfileScreen, FavoritesScreen, type BookingTab } from "./customer-screens";
import { DiscoverScreen, ProfileScreen, ReviewScreen, ScheduleScreen, ServiceAreaScreen, TrackingScreen } from "./screens";
import {
  SERVICE_RADIUS_MAX, SERVICE_RADIUS_MIN, agendaDateLabels, agendaDays, agendaTimes,
  barbers, bookingStages, days, slots, type Barber, type Screen
} from "./data";

export default function BarberGoDemo() {
  const [screen, setScreen] = useState<Screen>("home");
  const [role, setRole] = useState<"cliente" | "barbeiro" | "admin">("cliente");
  const [address, setAddress] = useState("Rua Comendador Araújo, Batel");
  const [selected, setSelected] = useState<Barber>(barbers[0]);
  const [view, setView] = useState<"list" | "map">("list");
  const [favorites, setFavorites] = useState<number[]>([2]);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [radius, setRadius] = useState(6);
  const [barberAvailable, setBarberAvailable] = useState(true);
  const [agendaDay, setAgendaDay] = useState(1);
  const [blockedAgendaSlots, setBlockedAgendaSlots] = useState<Record<number, string[]>>({});
  const [toast, setToast] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [availableToday, setAvailableToday] = useState(false);
  const [maxDistance, setMaxDistance] = useState(5);
  const [sortBy, setSortBy] = useState<"distance" | "rating">("distance");
  const [bookingStage, setBookingStage] = useState(1);
  const [bookingTab, setBookingTab] = useState<BookingTab>("upcoming");
  const [barberName, setBarberName] = useState("Rafael Mendes");
  const [portfolioCount, setPortfolioCount] = useState(3);
  const [bookingCreated, setBookingCreated] = useState(false);
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [requestStates, setRequestStates] = useState<Record<string, "pending" | "accepted" | "declined">>({ "João Victor": "pending", "Pedro Lima": "pending" });
  const [adminSection, setAdminSection] = useState<AdminSection>("overview");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("barbergo-demo-preferences");
      if (stored) {
        const preferences = JSON.parse(stored) as { favorites?: number[]; address?: string; radius?: number; barberName?: string };
        if (preferences.favorites) setFavorites(preferences.favorites);
        if (preferences.address) setAddress(preferences.address);
        if (preferences.radius && preferences.radius >= SERVICE_RADIUS_MIN && preferences.radius <= SERVICE_RADIUS_MAX) setRadius(preferences.radius);
        if (preferences.barberName) setBarberName(preferences.barberName);
      }
    } catch { /* Local storage is optional in this prototype. */ }
    setPreferencesReady(true);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    try {
      window.localStorage.setItem("barbergo-demo-preferences", JSON.stringify({ favorites, address, radius, barberName }));
    } catch { /* Persistence is optional. */ }
  }, [address, barberName, favorites, preferencesReady, radius]);

  const showToast = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  // As coordenadas não são enviadas nem salvas; a demo só confirma a permissão.
  const useCurrentLocation = () => {
    if (!navigator.geolocation) { showToast("Seu navegador não suporta localização"); return; }
    showToast("Buscando sua localização...");
    navigator.geolocation.getCurrentPosition(
      () => { setAddress("Localização atual — Curitiba, PR"); showToast("Localização atual aplicada (demo)"); },
      (error) => showToast(error.code === error.PERMISSION_DENIED ? "Permissão negada. Digite seu endereço." : "Não foi possível obter a localização."),
      { timeout: 8000, maximumAge: 60000 }
    );
  };
  const go = (next: Screen) => { setScreen(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const filtered = useMemo(() => barbers
    .filter((barber) => !availableToday || barber.next.startsWith("Hoje"))
    .filter((barber) => Number(barber.distance.replace(",", ".").replace(" km", "")) <= maxDistance)
    .sort((a, b) => sortBy === "distance"
      ? Number(a.distance.replace(",", ".")) - Number(b.distance.replace(",", "."))
      : b.rating - a.rating), [availableToday, maxDistance, sortBy]);
  const toggleFavorite = (id: number) => setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const toggleAgendaSlot = (day: number, slot: string) => setBlockedAgendaSlots((current) => {
    const blocked = current[day] ?? [];
    return { ...current, [day]: blocked.includes(slot) ? blocked.filter((item) => item !== slot) : [...blocked, slot] };
  });
  const addAgendaBlock = () => {
    const slot = agendaTimes.find((time) => (time !== "14:30" || agendaDay !== 1) && !(blockedAgendaSlots[agendaDay] ?? []).includes(time));
    if (!slot) {
      showToast("Não há horários livres para bloquear neste dia");
      return;
    }
    toggleAgendaSlot(agendaDay, slot);
    showToast(`Horário das ${slot} bloqueado`);
  };
  const activeCustomerTab: "discover" | "bookings" | "favorites" | "profile" | null =
    ["discover", "profile", "schedule", "review"].includes(screen) ? "discover"
      : ["tracking", "bookings"].includes(screen) ? "bookings"
        : screen === "favorites" ? "favorites"
          : screen === "customerProfile" ? "profile" : null;

  const switchRole = (next: "cliente" | "barbeiro" | "admin") => {
    setRole(next);
    go(next === "cliente" ? "home" : next === "barbeiro" ? "barber" : "admin");
  };
  const openDiscover = () => {
    setDiscoverLoading(true);
    go("discover");
    window.setTimeout(() => setDiscoverLoading(false), 520);
  };

  return <main className={role === "cliente" && activeCustomerTab ? "has-bottom-nav" : ""}>
    <header className="topbar">
      <button className="brand" onClick={() => switchRole("cliente")} aria-label="Ir para início"><span>✦</span>BarberGo</button>
      <nav aria-label="Navegação principal"><button onClick={() => go("discover")}>Explorar</button><button onClick={() => switchRole("barbeiro")}>Para barbeiros</button><button onClick={() => showToast("Este é um perfil demonstrativo")}>Ajuda</button></nav>
      <div className="role-switch" aria-label="Alternar modo de demonstração">
        {(["cliente", "barbeiro", "admin"] as const).map((item) => <button key={item} className={role === item ? "active" : ""} onClick={() => switchRole(item)}>{item}</button>)}
      </div>
    </header>

    {screen === "home" && <section className="landing">
      <div className="landing-copy"><p className="eyebrow">BARBERGO EM CURITIBA</p><h1>Seu próximo corte,<br /><em>no conforto de casa.</em></h1><p className="lead">Encontre barbeiros independentes que atendem onde você estiver. Simples, confiável e no seu tempo.</p>
        <div className="location-box"><MapPin size={20}/><div><small>Onde você está?</small><strong>{address}</strong></div><button className="icon-btn" onClick={() => go("location")} aria-label="Alterar endereço"><ChevronRight /></button></div>
        <button className="primary" onClick={openDiscover}>Encontrar barbeiros <ArrowLeft className="flip" size={18}/></button>
        <p className="demo-note">Protótipo com profissionais e dados demonstrativos.</p>
      </div>
      <div className="hero-card"><div className="hero-image"><Avatar barber={barbers[0]} size="lg"/></div><div className="floating rating-float"><Star size={16} fill="currentColor"/> 4,9 <small>• 128 avaliações</small></div><div className="floating service-float"><Check size={16}/> Atendimento em domicílio</div><div className="hero-caption"><b>Rafael Mendes</b><span>Barbeiro em Curitiba</span></div></div>
      <div className="how"><div><span>01</span><b>Escolha o local</b><p>Informe onde quer ser atendido.</p></div><div><span>02</span><b>Encontre seu barbeiro</b><p>Compare perfis e disponibilidades.</p></div><div><span>03</span><b>Agende seu horário</b><p>Envie sua solicitação em segundos.</p></div></div>
    </section>}

    {screen === "location" && <Page title="Onde você quer cortar o cabelo?" back={() => go("home")} subtitle="Use um endereço demonstrativo para encontrar barbeiros na sua região.">
      <div className="search-field"><Search size={20}/><input value={address} onChange={(e) => setAddress(e.target.value)} aria-label="Endereço"/><button onClick={() => setAddress("")} aria-label="Limpar endereço"><X size={18}/></button></div>
      <button className="secondary wide" onClick={useCurrentLocation}><Navigation size={18}/> Usar minha localização</button>
      <h3>Endereços recentes</h3><div className="address-list">{["Rua Comendador Araújo, Batel", "Rua Itupava, Alto da XV"].map((item) => <button key={item} aria-pressed={address === item} onClick={() => setAddress(item)}><MapPin/>{item}{address === item && <Check size={18} className="address-check"/>}</button>)}</div>
      <button className="primary sticky-action" onClick={openDiscover}>Confirmar localização</button>
    </Page>}

    {screen === "discover" && <DiscoverScreen address={address} barbers={filtered} favorites={favorites} loading={discoverLoading} view={view} sortBy={sortBy} filterOpen={filterOpen} availableToday={availableToday} maxDistance={maxDistance} onBack={() => go("home")} onEditLocation={() => go("location")} onFilterOpen={setFilterOpen} onView={setView} onSort={setSortBy} onAvailableToday={setAvailableToday} onMaxDistance={setMaxDistance} onFavorite={toggleFavorite} onSelect={setSelected} onOpenProfile={(barber) => { if (barber) setSelected(barber); go("profile"); }} />}

    {screen === "profile" && <ProfileScreen barber={selected} favorite={favorites.includes(selected.id)} onBack={() => go("discover")} onFavorite={() => toggleFavorite(selected.id)} onSchedule={() => go("schedule")} />}

    {screen === "schedule" && <ScheduleScreen barber={selected} selectedDay={selectedDay} selectedSlot={selectedSlot} onBack={() => go("profile")} onDay={(index) => { setSelectedDay(index); setSelectedSlot(null); }} onSlot={(slot) => setSelectedSlot((current) => current === slot ? null : slot)} onContinue={() => go("review")} />}

    {screen === "review" && <ReviewScreen barber={selected} selectedDay={selectedDay} selectedSlot={selectedSlot} address={address} onBack={() => go("schedule")} onSubmit={() => { setBookingCreated(true); setBookingStage(1); go("tracking"); showToast("Solicitação demonstrativa enviada!"); }} />}

    {screen === "tracking" && <TrackingScreen barber={selected} stage={bookingStage} selectedDay={selectedDay} selectedSlot={selectedSlot} address={address} onBack={() => go("bookings")} onAdvance={() => { setBookingStage((stage) => stage + 1); showToast("Etapa atualizada na demonstração"); }} onSupport={() => showToast("Suporte demonstrativo — nenhum atendimento real foi iniciado")} />}

    {screen === "bookings" && <BookingsScreen tab={bookingTab} created={bookingCreated} stage={bookingStage} barber={selected} dayIndex={selectedDay} slot={selectedSlot} address={address} onTab={setBookingTab} onDetails={() => go("tracking")} onRebook={() => { setSelectedSlot(null); go("schedule"); }} onExplore={openDiscover} />}

    {screen === "favorites" && <FavoritesScreen favorites={favorites} onFavorite={toggleFavorite} onOpen={(barber) => { setSelected(barber); go("profile"); }} onExplore={() => go("discover")} />}

    {screen === "customerProfile" && <CustomerProfileScreen onEdit={() => showToast("Edição simulada ativada")} onBookings={() => go("bookings")} onFavorites={() => go("favorites")} onAddresses={() => go("location")} onHelp={() => showToast("Central de ajuda demonstrativa")} />}

    {screen === "barber" && <BarberDashboard name={barberName} available={barberAvailable} go={go} onToggleAvailable={() => { setBarberAvailable((available) => !available); showToast(barberAvailable ? "Disponibilidade desativada na demonstração" : "Disponibilidade ativada na demonstração"); }} />}

    {screen === "area" && <ServiceAreaScreen radius={radius} onBack={() => go("barber")} onRadius={setRadius} onSave={() => showToast(`Área de ${radius} km salva nesta demonstração`)} />}

    {screen === "requests" && <RequestsScreen states={requestStates} onBack={() => go("barber")} onDecide={(name, state) => { setRequestStates((states) => ({ ...states, [name]: state })); showToast(state === "accepted" ? "Solicitação aceita — demonstração" : "Solicitação recusada — demonstração"); }} />}

    {screen === "barberProfile" && <BarberProfileScreen name={barberName} onName={setBarberName} onBack={() => go("barber")} onSave={() => { showToast("Perfil demonstrativo salvo"); go("barber"); }} />}

    {screen === "agenda" && <AgendaScreen day={agendaDay} blocked={blockedAgendaSlots} onBack={() => go("barber")} onDay={setAgendaDay} onToggle={(day, time) => { const wasBlocked = (blockedAgendaSlots[day] ?? []).includes(time); toggleAgendaSlot(day, time); showToast(`Horário das ${time} ${wasBlocked ? "liberado" : "bloqueado"}`); }} onAddBlock={addAgendaBlock} />}

    {screen === "portfolio" && <PortfolioScreen count={portfolioCount} onBack={() => go("barber")} onRemove={() => setPortfolioCount(portfolioCount - 1)} onAdd={() => { setPortfolioCount(portfolioCount + 1); showToast("Imagem demonstrativa adicionada"); }} />}

    {screen === "admin" && <AdminScreen section={adminSection} onSection={setAdminSection} />}

    {role === "cliente" && !["home", "location"].includes(screen) && <nav className="bottom-nav" aria-label="Navegação inferior"><button type="button" onClick={() => go("home")}><Home/>Início</button><button type="button" className={activeCustomerTab === "discover" ? "active" : ""} aria-current={activeCustomerTab === "discover" ? "page" : undefined} onClick={() => go("discover")}><Search/>Explorar</button><button type="button" className={activeCustomerTab === "bookings" ? "active" : ""} aria-current={activeCustomerTab === "bookings" ? "page" : undefined} onClick={() => go("bookings")}><CalendarDays/>Agenda</button><button type="button" className={activeCustomerTab === "favorites" ? "active" : ""} aria-current={activeCustomerTab === "favorites" ? "page" : undefined} onClick={() => go("favorites")}><Heart/>Favoritos</button><button type="button" className={activeCustomerTab === "profile" ? "active" : ""} aria-current={activeCustomerTab === "profile" ? "page" : undefined} onClick={() => go("customerProfile")}><UserRound/>Perfil</button></nav>}
    {toast && <div className="toast" role="status" aria-live="polite"><Check size={18}/>{toast}</div>}
  </main>;
}

