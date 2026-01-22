# Dao Yu 101 - Projekt Setup Guide

## Übersicht

Dieses Dokument beschreibt die Einrichtung und Konfiguration der Dao Yu 101 Lernplattform mit Windsurf IDE Integration.

## Projektstruktur

```
dao-yu-101/
├── frontend/                 # Next.js Frontend
│   ├── src/
│   │   ├── app/             # App Router Seiten
│   │   ├── components/      # React Komponenten
│   │   ├── lib/            # Utilities und Helfer
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── types/          # TypeScript Typen
│   │   └── store/          # State Management
│   ├── public/             # Statische Assets
│   └── package.json
├── backend/                 # Node.js/Express Backend
│   ├── src/
│   │   ├── controllers/    # API Controller
│   │   ├── routes/         # API Routes
│   │   ├── middleware/     # Express Middleware
│   │   ├── models/         # Datenbank Modelle
│   │   ├── services/       # Business Logik
│   │   ├── utils/          # Backend Utilities
│   │   └── types/          # TypeScript Typen
│   └── package.json
├── shared/                  # Geteilte Typen und Utilities
│   └── types/
├── docs/                    # Dokumentation
├── windsurf/                # Windsurf IDE Konfiguration
└── README.md
```

## Voraussetzungen

### Software
- **Node.js** 18+ 
- **npm** oder **yarn**
- **PostgreSQL** 14+
- **Redis** (optional, für Caching)
- **Git**

### IDE Extensions (Windsurf)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Tailwind CSS IntelliSense
- TypeScript Importer
- GitLens

## Installation

### 1. Repository klonen
```bash
git clone <repository-url>
cd dao-yu-101
```

### 2. Dependencies installieren
```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
```

### 3. Umgebung konfigurieren

#### Backend Environment
```bash
cd backend
cp .env.example .env
```

Bearbeite `.env` mit deinen Konfigurationen:
- `DATABASE_URL`: PostgreSQL Verbindungsstring
- `JWT_SECRET`: Sicheres JWT Secret
- `SMTP_*`: Email Konfiguration
- `FRONTEND_URL`: Frontend URL

#### Frontend Environment
```bash
cd frontend
cp .env.example .env.local
```

### 4. Datenbank einrichten

#### PostgreSQL Setup
```sql
CREATE DATABASE dao_yu_101;
CREATE USER dao_yu_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE dao_yu_101 TO dao_yu_user;
```

#### Migrationen ausführen
```bash
cd backend
npm run db:migrate
npm run db:generate
```

### 5. Entwicklungsserver starten

#### Full Stack (empfohlen)
```bash
# Im Root Verzeichnis
npm run dev
```

#### Einzelne Services
```bash
# Backend
cd backend
npm run dev

# Frontend (in neuem Terminal)
cd frontend
npm run dev
```

## Windsurf IDE Konfiguration

### 1. Workspace Setup
- Öffne das Projekt in Windsurf
- Stelle sicher, dass alle Extensions installiert sind
- Lade die `windsurf/.windsurfrc.json` Konfiguration

### 2. Debug Konfiguration
Die Debug-Konfiguration ist bereits in `.windsurfrc.json` enthalten:
- **Debug Next.js**: Frontend Debugging
- **Debug Backend**: Backend Debugging mit TypeScript

### 3. Code Snippets
Minecraft-spezifische Snippets sind konfiguriert:
- `minecraft-component`: Erstellt Minecraft-stylische Komponente
- `minecraft-button`: Erstellt Minecraft Button
- `minecraft-card`: Erstellt Minecraft Card

## Entwicklung

### Code Style
- **ESLint** + **Prettier** für konsistenten Code
- **TypeScript** für Typensicherheit
- **Conventional Commits** für Git Messages

### Testing
```bash
# Frontend Tests
cd frontend
npm test

# Backend Tests
cd backend
npm test
```

### Building
```bash
# Production Build
npm run build

# Einzelne Builds
npm run build:frontend
npm run build:backend
```

## Nützliche Commands

### Backend
```bash
npm run dev          # Entwicklungsserver
npm run build        # TypeScript kompilieren
npm run start        # Production Server
npm run lint         # Code Linting
npm run db:studio    # Prisma Studio
npm run db:migrate   # Datenbank Migrationen
```

### Frontend
```bash
npm run dev          # Entwicklungsserver
npm run build        # Production Build
npm run start        # Production Server
npm run lint         # Code Linting
npm run type-check   # TypeScript Prüfung
```

## Troubleshooting

### Häufige Probleme

#### 1. TypeScript Fehler
```bash
# Types neu generieren
cd backend && npm run db:generate
cd frontend && npm run type-check
```

#### 2. Datenbank Verbindung
```bash
# Prüfe PostgreSQL Status
pg_isready -h localhost -p 5432

# Prüfe Environment Variablen
cd backend && cat .env
```

#### 3. Port Konflikte
```bash
# Prozesse auf Ports 3000/3001 prüfen
netstat -an | grep :3000
netstat -an | grep :3001
```

#### 4. Dependencies
```bash
# Cache leeren und neu installieren
rm -rf node_modules package-lock.json
npm install
```

## Deployment

### Vorbereitung
1. Environment Variablen für Production konfigurieren
2. Datenbank für Production einrichten
3. SSL Zertifikate konfigurieren

### Build
```bash
npm run build
```

### Production Start
```bash
npm start
```

## Windsurf Features

### Live Preview
- Automatische Vorschau bei Code-Änderungen
- Hot Module Replacement (HMR)
- Browser-Sync für Cross-Browser Testing

### Git Integration
- Visuelle Git History
- Branch Management
- Commit Message Vorlagen

### Code Intelligence
- Auto-completion für Minecraft-Komponenten
- TypeScript IntelliSense
- Refactoring Tools

## Support

Bei Problemen:
1. Prüfe die Logs in der Windsurf Console
2. Konsultiere die Troubleshooting Sektion
3. Erstelle ein Issue im Repository

## Nächste Schritte

Nach dem Setup:
1. [ ] Benutzer-Authentifizierung implementieren
2. [ ] Kurs-Management entwickeln
3. [ ] Minecraft UI Components erweitern
4. [ ] Analytics und Reporting hinzufügen
5. [ ] Mobile PWA Features implementieren
