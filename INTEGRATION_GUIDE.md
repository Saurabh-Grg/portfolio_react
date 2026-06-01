# Portfolio Backend Integration Guide

## Stack
- **Backend:** Node.js + Express (ESM)
- **Database:** PostgreSQL
- **Auth:** JWT (7-day expiry, auto-refresh on 401)
- **Frontend:** React + TanStack Query v5 + Axios

---

## Project Structure

```
portfolio/
├── backend/
│   ├── db/
│   │   ├── pool.js          ← PostgreSQL connection pool
│   │   └── schema.sql       ← Run once to init all tables
│   ├── middleware/
│   │   └── auth.js          ← JWT sign/verify + requireAuth middleware
│   ├── routes/
│   │   ├── auth.js          ← POST /login, POST /register, GET /me
│   │   ├── profile.js       ← GET, PUT /profile
│   │   ├── projects.js      ← Full CRUD /projects
│   │   ├── skills.js        ← Full CRUD /skills
│   │   ├── experience.js    ← Full CRUD /experience
│   │   ├── testimonials.js  ← Full CRUD /testimonials
│   │   └── messages.js      ← POST (public), GET/PATCH/DELETE (admin)
│   ├── server.js            ← Express app entry point
│   ├── package.json
│   └── .env.example         ← Copy to .env and fill in values
│
└── frontend/
    └── src/
        ├── lib/
        │   ├── api.ts           ← Axios instance with JWT interceptors
        │   └── services.ts      ← All API call functions
        ├── hooks/
        │   └── usePortfolioQueries.ts  ← React Query hooks (replaces context)
        └── contexts/
            └── AuthContext.tsx  ← JWT auth context (replaces mock auth)
```

---

## Step 1: Database Setup

```bash
# Create the database
psql -U postgres
CREATE DATABASE portfolio_db;
\q

# Run the schema
psql -U postgres -d portfolio_db -f backend/db/schema.sql
```

---

## Step 2: Backend Setup

```bash
cd backend

# Copy env file and fill in your values
cp .env.example .env

# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev
```

Your API will be at `http://localhost:5002`.

### Create your admin account (run once)

```bash
curl -X POST http://localhost:5002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"yourSecurePassword123"}'
```

> **Important:** After creating your admin account, consider disabling the `/register` route in `routes/auth.js` for security.

---

## Step 3: Frontend Setup

```bash
cd frontend

# Copy env and set API URL
cp .env.example .env

# Install axios (if not already)
npm install axios
```

### Wire up AuthContext in your app root

In your `main.tsx` or `App.tsx`, wrap with `AuthProvider`:

```tsx
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* your routes */}
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

### Replace mock auth in Admin login component

```tsx
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // redirect to dashboard
    } catch (err) {
      setError("Invalid credentials");
    }
  };
};
```

### Replace localStorage reads with React Query hooks

**Before (localStorage):**
```tsx
const { projects } = usePortfolio();
```

**After (API):**
```tsx
import { useProjects, useDeleteProject } from "@/hooks/usePortfolioQueries";

const { data: projects, isLoading } = useProjects();
const deleteProject = useDeleteProject();

// Delete
deleteProject.mutate(project.id);
```

### CRUD usage examples

**Create:**
```tsx
const createProject = useCreateProject();
createProject.mutate({
  title: "My App",
  description: "...",
  tags: ["React", "TypeScript"],
  demo_url: "https://...",
  github_url: "https://...",
  featured: true,
});
```

**Update:**
```tsx
const updateSkill = useUpdateSkill();
updateSkill.mutate({ id: skill.id, name: "TypeScript", percentage: 90 });
```

**Contact form (public):**
```tsx
const sendMessage = useSendMessage();
sendMessage.mutate({ name, email, subject, message });
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| POST | `/api/auth/register` | ❌ | Create admin user |
| GET | `/api/auth/me` | ✅ | Verify token |
| GET | `/api/profile` | ❌ | Get profile |
| PUT | `/api/profile` | ✅ | Update profile |
| GET | `/api/projects` | ❌ | List all projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| GET | `/api/skills` | ❌ | List all skills |
| POST | `/api/skills` | ✅ | Create skill |
| PUT | `/api/skills/:id` | ✅ | Update skill |
| DELETE | `/api/skills/:id` | ✅ | Delete skill |
| GET | `/api/experience` | ❌ | List all experience |
| POST | `/api/experience` | ✅ | Create entry |
| PUT | `/api/experience/:id` | ✅ | Update entry |
| DELETE | `/api/experience/:id` | ✅ | Delete entry |
| GET | `/api/testimonials` | ❌ | List all testimonials |
| POST | `/api/testimonials` | ✅ | Create testimonial |
| PUT | `/api/testimonials/:id` | ✅ | Update testimonial |
| DELETE | `/api/testimonials/:id` | ✅ | Delete testimonial |
| POST | `/api/messages` | ❌ | Send contact message |
| GET | `/api/messages` | ✅ | List all messages |
| PATCH | `/api/messages/:id/read` | ✅ | Mark as read |
| DELETE | `/api/messages/:id` | ✅ | Delete message |

---

## Migration from localStorage

The `PortfolioContext.tsx` powered by localStorage can be phased out gradually:

1. Keep `PortfolioContext` temporarily for components not yet migrated
2. Replace each section one at a time using the hooks in `usePortfolioQueries.ts`
3. Once all sections use API hooks, remove `PortfolioContext.tsx`

---

## Security Checklist for Production

- [ ] Change `JWT_SECRET` to a long random string (32+ chars)
- [ ] Set strong DB password
- [ ] Disable or protect `/api/auth/register` after creating your admin
- [ ] Set `CLIENT_URL` to your real domain (not `*`)
- [ ] Use HTTPS in production
- [ ] Add rate limiting to auth endpoints (`express-rate-limit`)
- [ ] Store JWT secret in a secrets manager (not plain `.env`)
