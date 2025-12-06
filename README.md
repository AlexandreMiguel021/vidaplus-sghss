# SGHSS — Sistema de Gestão Hospitalar e de Serviços de Saúde

Plataforma web usada pela **VidaPlus** para centralizar operação clínica e administrativa: do agendamento à telemedicina, passando por prontuários e gestão de leitos.

## Entrega

- Cadastros de pacientes, profissionais e setores com visão única
- Agenda médica com teleconsulta integrada e prescrições digitais
- Fluxo administrativo (internação, leitos, suprimentos, relatórios)
- Controle de acesso baseado em perfis de usuário

## Stack (front-end)

- React 19 + TypeScript, com Vite e React Router DOM
- Tailwind CSS, Radix UI, CVA, Lucide; fonte principal Montserrat
- React Hook Form + Zod para formulários; Zustand para estado
- Recharts, React Big Calendar e date-fns para visualizações e datas

## Como rodar

1. Node 18+ e npm instalados.
2. Na raiz do front (`sghss-frontend`):
   ```bash
   npm install
   npm run dev
   ```
3. Acesse `http://localhost:5173`.

Scripts úteis:

```bash
npm run dev      # desenvolvimento
npm run build    # build de produção
npm run preview  # serve do build
npm run lint     # checagens
```

## Estrutura (visão rápida)

```
src/
├── app/           # bootstrap e roteamento
├── components/    # ui, layout, shared
├── features/      # domínios: auth, patients, appointments, etc.
├── lib/           # utilitários
├── stores/        # Zustand stores
├── types/         # tipos globais
├── hooks/         # custom hooks
├── mocks/         # dados mockados
└── styles/        # CSS global
```

## Design System

Paleta em uso:

```css
/* Muted Teal */
muted-teal: #81a684;
muted-teal-light: #a3c1a6;
muted-teal-dark: #6a8c6d;

/* Jungle Teal */
jungle-teal: #57886c;
jungle-teal-light: #7aa88b;
jungle-teal-dark: #46705a;

/* Granite */
granite: #466060;
granite-light: #5a7a7a;
granite-dark: #364d4d;
```

Tipografia: Montserrat (300, 400, 500, 600, 700).

## Funcionalidades por módulo

- **Pacientes:** cadastro, histórico clínico, agendamentos, teleconsulta.
- **Profissionais:** gestão de agendas, prontuários, receitas digitais.
- **Administração:** cadastros institucionais, internações, leitos, suprimentos, relatórios.
- **Telemedicina:** videochamada segura, registro online, prescrição.

## Segurança

- Controle de acesso baseado em perfis de usuário (paciente, profissional, admin)
- Rotas protegidas com autenticação

---

Projeto Multidisciplinar — UNINTER 2025
