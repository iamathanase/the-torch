# FarmDialogue Dashboard Project Setup

## Project Overview
React 18 + TypeScript + Vite application with multi-role dashboards (Admin, Seller, Customer), Tailwind CSS, Shadcn UI components, and React Router navigation.

## Setup Checklist

- [x] Create .github directory and copilot-instructions.md file
- [ ] Scaffold Vite React project
- [ ] Install all required dependencies
- [ ] Create project structure (pages, components, layouts, contexts)
- [ ] Build dashboard pages (Overview, Orders, Listings, Messages, Settings, Users)
- [ ] Set up routing and authentication context
- [ ] Configure Tailwind CSS
- [ ] Add Shadcn UI components
- [ ] Create DashboardLayout with responsive sidebar
- [ ] Verify project compiles without errors
- [ ] Test project locally

## Project Structure
```
src/
  ├── pages/
  │   ├── dashboard/
  │   │   ├── Overview.tsx
  │   │   ├── Orders.tsx
  │   │   ├── Listings.tsx
  │   │   ├── Messages.tsx
  │   │   ├── Settings.tsx
  │   │   └── Users.tsx
  │   ├── auth/
  │   ├── Index.tsx
  │   └── NotFound.tsx
  ├── layouts/
  │   ├── DashboardLayout.tsx
  │   └── PublicLayout.tsx
  ├── components/
  │   ├── dashboard/
  │   │   └── StatCard.tsx
  │   └── ui/ (Shadcn components)
  ├── context/
  │   ├── AuthContext.tsx
  │   └── DataContext.tsx
  ├── data/
  │   ├── types.ts
  │   └── mockData.ts
  └── App.tsx
```

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
