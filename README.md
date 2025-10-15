# MMN-Store
A apps store

mmn-store/
├── public/
│   ├── icons/
│   │   ├── default-app-icon.png
│   │   └── default-avatar.png
│   └── images/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── AdBanner.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── auth/
│   │   │   └── LoginButton.tsx
│   │   ├── app/
│   │   │   ├── AppCard.tsx
│   │   │   ├── AppDetail.tsx
│   │   │   ├── AppList.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── FeaturedCarousel.tsx
│   │   ├── dashboard/
│   │   │   ├── DeveloperDashboard.tsx
│   │   │   ├── ModeratorDashboard.tsx
│   │   │   └── AdminDashboard.tsx
│   │   └── upload/
│   │       └── AppUploadForm.tsx
│   ├── config/
│   │   ├── firebase.ts
│   │   └── backblaze.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFirestore.ts
│   │   └── useBackblaze.ts
│   ├── lib/
│   │   ├── backblaze.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── app/
│   │   │   └── [id].tsx
│   │   ├── dashboard/
│   │   │   ├── developer.tsx
│   │   │   ├── moderator.tsx
│   │   │   └── admin.tsx
│   │   └── upload.tsx
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       ├── auth.ts
│       └── app.ts
├── .env.local
├── .gitignore
├── netlify.toml
├── next.config.js
├── package.json
└── README.md
