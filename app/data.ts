// Dados demonstrativos. Substituir por chamadas de API na integração real.
export type Barber = { id: number; name: string; neighborhood: string; distance: string; rating: number; reviews: number; next: string; price: number; initials: string; color: string; bio: string; tags: string[] };
export type Screen = "home" | "location" | "discover" | "profile" | "schedule" | "review" | "tracking" | "bookings" | "favorites" | "customerProfile" | "barber" | "area" | "requests" | "barberProfile" | "agenda" | "portfolio" | "admin";

export const barbers: Barber[] = [
  { id: 1, name: "Rafael Mendes", neighborhood: "Batel", distance: "1,2 km", rating: 4.9, reviews: 128, next: "Hoje, 14:30", price: 65, initials: "RM", color: "#d5b38a", bio: "Especialista em cortes clássicos, degradês e acabamento preciso.", tags: ["Degradê", "Barba", "Clássico"] },
  { id: 2, name: "Caio Nunes", neighborhood: "Água Verde", distance: "2,0 km", rating: 4.8, reviews: 94, next: "Hoje, 16:00", price: 60, initials: "CN", color: "#93a8a0", bio: "Atendimento tranquilo, pontual e pensado para a sua rotina.", tags: ["Social", "Degradê", "Infantil"] },
  { id: 3, name: "Lucas Azevedo", neighborhood: "Centro", distance: "2,8 km", rating: 5.0, reviews: 67, next: "Amanhã, 09:00", price: 70, initials: "LA", color: "#a88c7d", bio: "Cortes contemporâneos e consultoria de estilo no conforto da sua casa.", tags: ["Tesoura", "Moderno", "Barba"] },
  { id: 4, name: "Bruno Tavares", neighborhood: "Bigorrilho", distance: "3,1 km", rating: 4.7, reviews: 51, next: "Amanhã, 10:30", price: 55, initials: "BT", color: "#728c9d", bio: "Barbeiro há 8 anos, com agenda flexível para atendimento em domicílio.", tags: ["Clássico", "Navalha"] },
  { id: 5, name: "Thiago Prado", neighborhood: "Portão", distance: "3,6 km", rating: 4.6, reviews: 38, next: "Hoje, 18:00", price: 50, initials: "TP", color: "#8f9a75", bio: "Cortes rápidos e bem acabados para quem tem pouco tempo.", tags: ["Degradê", "Social"] },
  { id: 6, name: "Diego Farias", neighborhood: "Cabral", distance: "1,8 km", rating: 4.9, reviews: 112, next: "Hoje, 15:15", price: 68, initials: "DF", color: "#b58a8a", bio: "Visagismo masculino, tesoura e barba alinhada.", tags: ["Tesoura", "Barba", "Moderno"] },
  { id: 7, name: "Mateus Klein", neighborhood: "Juvevê", distance: "2,3 km", rating: 4.8, reviews: 76, next: "Amanhã, 08:00", price: 62, initials: "MK", color: "#7f8fb5", bio: "Atendimento premium com produtos profissionais.", tags: ["Premium", "Clássico"] },
  { id: 8, name: "André Vasconcelos", neighborhood: "Santa Felicidade", distance: "4,5 km", rating: 4.5, reviews: 29, next: "Amanhã, 13:00", price: 48, initials: "AV", color: "#a69a6b", bio: "Preço acessível, pontualidade e capricho no acabamento.", tags: ["Social", "Infantil"] },
  { id: 9, name: "Henrique Sato", neighborhood: "Rebouças", distance: "2,6 km", rating: 4.9, reviews: 143, next: "Hoje, 17:00", price: 72, initials: "HS", color: "#6fa39a", bio: "Fade impecável, cortes texturizados e navalha.", tags: ["Degradê", "Navalha", "Moderno"] },
  { id: 10, name: "Gabriel Rocha", neighborhood: "Mercês", distance: "3,3 km", rating: 4.7, reviews: 58, next: "Qua, 11:30", price: 58, initials: "GR", color: "#9d7fa8", bio: "Cortes clássicos e barboterapia em domicílio.", tags: ["Clássico", "Barba"] }
];

export const slots = ["09:00", "10:30", "13:00", "14:30", "16:00", "17:30"];
export const demoToday = new Date(2025, 10, 4);
export const maxBookingDays = 30;
const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const days = Array.from({ length: maxBookingDays }, (_, index) => {
  if (index === 0) return "Hoje";
  const date = new Date(demoToday.getFullYear(), demoToday.getMonth(), demoToday.getDate() + index);
  return `${weekdays[date.getDay()]}, ${date.getDate()}`;
});
export const agendaDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export const agendaDateLabels = ["Segunda-feira, 3 de novembro", "Terça-feira, 4 de novembro", "Quarta-feira, 5 de novembro", "Quinta-feira, 6 de novembro", "Sexta-feira, 7 de novembro", "Sábado, 8 de novembro"];
export const agendaTimes = ["09:00", "10:30", "13:00", "14:30", "17:30"];
export const bookingStages = ["Aguardando resposta", "Solicitação aceita", "Atendimento confirmado", "Barbeiro a caminho", "Atendimento concluído"];
export const SERVICE_RADIUS_MIN = 1;
export const SERVICE_RADIUS_MAX = 15;
