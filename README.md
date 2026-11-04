# BarberGo — Frontend V1

Protótipo navegável do marketplace de barbeiros em domicílio, desenvolvido com Next.js, React e TypeScript. Todos os dados, preços, endereços, avaliações e estados são demonstrativos e vivem no estado local da interface.

Preferências de endereço, favoritos, raio de atendimento e nome do profissional são preservados no navegador com `localStorage` durante a demonstração.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Jornadas demonstrativas

- Cliente: localização → lista/mapa → perfil → horário → revisão → solicitação.
- Cliente: também inclui favoritos, acompanhamento por etapas, agendamentos e perfil demonstrativo.
- Barbeiro: painel → perfil editável → área de cobertura com raio interativo → agenda → solicitações → portfólio local.
- Administração: estrutura visual inicial pelo seletor de modo no cabeçalho.

## Estrutura visual

- `app/globals.css`: base e tokens.
- `app/mobile.css`: ajustes para telas até 720px.
- `app/theme.css`: camada visual moderna (cores, vidro translúcido, navegação flutuante, animações que respeitam movimento reduzido).

## Estrutura do código

- `app/page.tsx`: orquestrador de estado, navegação e landing/localização.
- `app/data.ts`: tipos e mocks (10 barbeiros, horários, etapas) — ponto de troca futura por API.
- `app/components.tsx`: componentes compartilhados (`Avatar`, `Page`, `BarberCard`, `MapDemo`, `Request`…).
- `app/screens.tsx`: telas do fluxo do cliente (descoberta, perfil, horário, revisão, acompanhamento, área de atendimento).
- `app/customer-screens.tsx`: agendamentos, favoritos e perfil do cliente.
- `app/live-map.tsx` e `app/area-map.tsx`: mapas MapLibre (descoberta de barbeiros e raio de atendimento), carregados só no cliente.
- `app/barber-screens.tsx`: painel, solicitações, perfil, agenda, portfólio e admin.

O painel de filtros usa [vaul](https://github.com/emilkowalski/vaul) (bottom sheet open source com arrastar para fechar, foco e acessibilidade). O mapa usa [MapLibre GL](https://maplibre.org/) com tiles do [OpenFreeMap](https://openfreemap.org/) (sem chave de API; requer internet). As posições dos barbeiros são aproximadas por bairro e demonstrativas. O worker do MapLibre é copiado para `public/` pelo `postinstall`.

## O que é simulado

10 barbeiros fictícios de Curitiba, avaliações e distribuição de notas, tempo estimado (~6 min/km), duração do serviço (~45 min), selo "Verificado (demo)", posição dos marcadores no mapa, horários e status de acompanhamento.

## Próximas integrações

O protótipo não contém backend, autenticação, persistência remota, pagamentos, geolocalização real ou mapas de terceiros. Esses pontos devem ser ligados a APIs reais em uma etapa posterior.

- **Seletor de datas:** em Escolha seu horário, Mais datas abre um calendário (react-day-picker, em bottom sheet vaul) com 30 dias a partir do dia demonstrativo.
