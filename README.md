# WhisperQ Frontend

React SPA for WhisperQ MVP - Anonymous Q&A and reaction platform for lectures.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router v6

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── ReactionButton.tsx
│   └── GlowEffect.tsx
├── pages/               # Page components
│   ├── JoinPage.tsx     # Session join (QR/code entry)
│   ├── AudiencePage.tsx # Audience reaction screen
│   ├── DashboardPage.tsx # Facilitator glow dashboard
│   └── AnalysisPage.tsx # Post-session analysis
├── stores/              # Zustand stores
│   ├── sessionStore.ts
│   └── reactionStore.ts
├── types/               # TypeScript types
│   └── index.ts
├── hooks/               # Custom hooks (TODO)
├── services/            # API services (TODO)
└── utils/               # Utility functions
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | JoinPage | Session join screen |
| `/s/:sessionCode` | AudiencePage | Audience reaction screen |
| `/dashboard/:sessionId` | DashboardPage | Facilitator glow effect |
| `/analysis/:sessionId` | AnalysisPage | Post-session analysis |

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Design Tokens

Based on the Stitch wireframe:

| Token | Value |
|-------|-------|
| Primary Color | `#4A90D9` |
| Confused Color | `#F59E0B` (amber) |
| More Color | `#3B82F6` (blue) |
| Button Radius | `8px` |
| Card Radius | `12px` |
| Spacing System | 8pt grid |

## TODO

- [ ] WebSocket integration (SockJS + STOMP)
- [ ] API service layer
- [ ] Authentication for facilitators
- [ ] QR code scanner
- [ ] Haptic feedback improvements
- [ ] PWA support
