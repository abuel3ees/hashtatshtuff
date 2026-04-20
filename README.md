# DIP SWITCH GAME

Interactive binary-learning game built with Laravel + Inertia + React.  
Players (student terminals) use an 8-bit DIP switch UI to match a live target number and earn points based on speed.

## Features

- Admin command center to:
  - Start/stop/reset game sessions
  - Set pulse interval (5/10/15/20s)
  - Generate terminal users in bulk
  - Monitor live lobby and leaderboard
- Student dashboard with:
  - 8-bit DIP switch controls (128..1)
  - Live target/pulse timer
  - Auto-submit when switch sum matches target
- Presentation screen at `/presentation` for workshop/class display

## Tech Stack

- **Backend:** Laravel 13, PHP 8.3
- **Frontend:** React + TypeScript, Inertia.js, Vite, Tailwind CSS
- **Queue/Cache/Session (default):** Database

## Requirements

- PHP 8.3+
- Composer
- Node.js + npm

## Quick Start

From the repository root:

```bash
composer run setup
php artisan db:seed
composer run dev
```

This will install dependencies, prepare `.env`, generate app key, run migrations, build assets, seed admin, and run:

- Laravel server
- Queue listener
- Log tailer
- Vite dev server

## Login

- **Admin**
  - Terminal ID: `admin`
  - Access Key: `admin`

- **Students / terminals**
  - Create terminals from Admin Dashboard (`Generate Terminals`)
  - Credentials are numeric:
    - Terminal ID = terminal number
    - Access Key = same terminal number

## Main Routes

- `/login` — terminal login
- `/dashboard` — student game screen
- `/admin` — admin command center
- `/presentation` — workshop presentation slides/screen

## Useful Commands

```bash
# Frontend checks
npm run lint:check
npm run format:check
npm run types:check

# Backend tests
php artisan test
```

## Game Flow

1. Admin generates terminals and starts the game.
2. System emits a random pulse number (0–255) on each interval.
3. Students flip DIP switches to match the target decimal value.
4. Correct match scores points based on remaining pulse time.
5. Leaderboard updates continuously.

