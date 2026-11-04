"use client";

import { Bell, CalendarDays, ChevronRight, Home, MapPin, Plus, UserRound, Users, X } from "lucide-react";
import { Metric, Page, Request } from "./components";
import { agendaDateLabels, agendaDays, agendaTimes, barbers } from "./data";

type RequestState = "pending" | "accepted" | "declined";
type Go = (screen: "area" | "requests" | "barberProfile" | "agenda" | "portfolio" | "barber") => void;

export function BarberDashboard({ name, available, onToggleAvailable, go }: { name: string; available: boolean; onToggleAvailable: () => void; go: Go }) {
  return <Page title={`Olá, ${name.split(" ")[0]}`} subtitle="Gerencie seus atendimentos em um só lugar.">
    <div className={`availability ${available ? "" : "unavailable"}`}><span className="online-dot" aria-hidden="true"/> <span aria-live="polite">{available ? "Você está disponível hoje" : "Você está indisponível"}</span><button type="button" aria-pressed={available} onClick={onToggleAvailable}>{available ? "Ficar indisponível" : "Ficar disponível"}</button></div>
    <div className="metric-row"><Metric value="2" label="solicitações novas"/><Metric value="3" label="atendimentos hoje"/><Metric value="4,9" label="avaliação demo"/></div>
    <section className="next-visit"><p>PRÓXIMO ATENDIMENTO</p><h2>Marcos Oliveira <span>14:30</span></h2><small>Água Verde · 2,1 km</small><button onClick={() => go("requests")}>Ver detalhes <ChevronRight size={16}/></button></section>
    <div className="quick-actions"><button onClick={() => go("area")}><MapPin/>Minha área de atendimento</button><button onClick={() => go("requests")}><Bell/>Solicitações recebidas <b>2</b></button><button onClick={() => go("barberProfile")}><UserRound/>Editar perfil</button><button onClick={() => go("agenda")}><CalendarDays/>Minha agenda</button><button onClick={() => go("portfolio")}><Plus/>Meu portfólio</button></div>
  </Page>;
}

const incoming = [
  { name: "João Victor", place: "Batel · 1,4 km", time: "Hoje, 17:30" },
  { name: "Pedro Lima", place: "Água Verde · 3,0 km", time: "Amanhã, 10:30" }
];

export function RequestsScreen({ states, onBack, onDecide }: { states: Record<string, RequestState>; onBack: () => void; onDecide: (name: string, state: "accepted" | "declined") => void }) {
  const pending = Object.values(states).filter((state) => state === "pending").length;
  return <Page title="Solicitações recebidas" back={onBack} subtitle={pending === 1 ? "1 nova solicitação para você." : `${pending} novas solicitações para você.`}>
    {incoming.map((item) => <Request key={item.name} {...item} status={states[item.name]} onAccept={() => onDecide(item.name, "accepted")} onDecline={() => onDecide(item.name, "declined")}/>)}
  </Page>;
}

export function BarberProfileScreen({ name, onName, onBack, onSave }: { name: string; onName: (value: string) => void; onBack: () => void; onSave: () => void }) {
  return <Page title="Meu perfil profissional" back={onBack} subtitle="As alterações são mantidas apenas durante esta demonstração.">
    <form className="profile-form" onSubmit={(event) => { event.preventDefault(); onSave(); }}><label>Nome profissional<input value={name} onChange={(e) => onName(e.target.value)} /></label><label>Apresentação<textarea defaultValue="Especialista em cortes clássicos, degradês e acabamento preciso." /></label><label>Experiência<input defaultValue="8 anos de experiência" /></label><label>Região-base<input defaultValue="Batel, Curitiba" /></label><button className="primary" type="submit">Salvar alterações</button></form>
  </Page>;
}

type AgendaProps = { day: number; blocked: Record<number, string[]>; onBack: () => void; onDay: (index: number) => void; onToggle: (day: number, time: string) => void; onAddBlock: () => void };

export function AgendaScreen({ day, blocked, onBack, onDay, onToggle, onAddBlock }: AgendaProps) {
  return <Page title="Minha agenda" back={onBack} subtitle="Organize sua disponibilidade semanal.">
    <div className="agenda-week" role="group" aria-label="Dias da agenda">{agendaDays.map((label, index) => <button type="button" className={day === index ? "selected" : ""} aria-pressed={day === index} key={label} onClick={() => onDay(index)}><small>{label}</small><b>{3 + index}</b></button>)}</div>
    <section className="info-card"><h2>{agendaDateLabels[day]}</h2><p className="demo-caption">Horários e atendimentos demonstrativos.</p><div className="availability-list">{agendaTimes.map((time) => {
      const isAppointment = day === 1 && time === "14:30";
      const isBlocked = (blocked[day] ?? []).includes(time);
      return <span className={isAppointment ? "agenda-appointment" : isBlocked ? "agenda-blocked" : "agenda-available"} key={time}><b>{time}</b>{isAppointment ? <><span>Marcos Oliveira</span><em>Atendimento confirmado</em></> : isBlocked ? <><span>Horário bloqueado</span><button type="button" onClick={() => onToggle(day, time)}>Liberar</button></> : <><span>Disponível</span><button type="button" onClick={() => onToggle(day, time)}>Bloquear</button></>}</span>;
    })}</div></section>
    <button className="secondary agenda-add-block" type="button" onClick={onAddBlock}><Plus size={17}/>Adicionar bloqueio</button>
  </Page>;
}

const portfolioLabels = ["Degradê", "Social", "Barba", "Texturizado"];

export function PortfolioScreen({ count, onBack, onRemove, onAdd }: { count: number; onBack: () => void; onRemove: () => void; onAdd: () => void }) {
  return <Page title="Meu portfólio" back={onBack} subtitle="Imagens demonstrativas armazenadas somente nesta sessão.">
    <div className="portfolio manager">{Array.from({ length: count }).map((_, index) => <div className="portfolio-item" key={index}><i>{portfolioLabels[index]}</i><button onClick={onRemove} aria-label="Remover imagem demonstrativa"><X size={15}/></button></div>)}</div>
    <button className="secondary" onClick={onAdd}><Plus size={17}/>Adicionar imagem demonstrativa</button>
  </Page>;
}

export type AdminSection = "overview" | "customers" | "barbers" | "bookings";
const adminTitles: Record<AdminSection, string> = { overview: "Visão geral", customers: "Clientes", barbers: "Barbeiros", bookings: "Agendamentos" };

export function AdminScreen({ section, onSection }: { section: AdminSection; onSection: (section: AdminSection) => void }) {
  const nav: [AdminSection, string, React.ReactNode][] = [["overview", "Visão geral", <Home key="h"/>], ["customers", "Clientes", <Users key="u"/>], ["barbers", "Barbeiros", <UserRound key="b"/>], ["bookings", "Agendamentos", <CalendarDays key="c"/>]];
  const items = section === "customers" ? ["Emerson Oliveira", "Marcos Souza", "João Victor"] : section === "barbers" ? barbers.map((barber) => barber.name) : ["Rafael Mendes · Hoje, 14:30", "Caio Nunes · Hoje, 16:00", "Lucas Azevedo · Amanhã, 09:00"];
  return <section className="admin"><aside><button className="brand" onClick={() => onSection("overview")}>✦ BarberGo</button><p>ADMINISTRAÇÃO · DEMO</p>{nav.map(([id, label, icon]) => <button key={id} className={section === id ? "admin-active" : ""} onClick={() => onSection(id)}>{icon}{label}</button>)}</aside>
    <div className="admin-main"><h1>{adminTitles[section]}</h1><p>Dados exclusivamente demonstrativos.</p>{section === "overview" ? <><div className="metric-row"><Metric value="128" label="clientes"/><Metric value="24" label="barbeiros"/><Metric value="42" label="agendamentos"/></div><section className="admin-table"><h2>Atividade recente</h2><p>João enviou uma solicitação para Rafael Mendes <b>agora</b></p><p>Caio Nunes atualizou sua área de atendimento <b>há 12 min</b></p></section></> : <section className="admin-table"><h2>{section === "customers" ? "Clientes recentes" : section === "barbers" ? "Profissionais ativos" : "Solicitações recentes"}</h2>{items.map((item) => <p key={item}>{item}<b>Demonstrativo</b></p>)}</section>}</div>
  </section>;
}
