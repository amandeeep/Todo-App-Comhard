# TaskFlow — Full-Stack Todo Management System

A production-ready task management application with secure authentication, three task views (List, Section, Kanban), SLA tracking, advanced filtering/sorting, and server-side pagination.

## Tech Stack

| Layer          | Technology                                    |
| -------------- | --------------------------------------------- |
| Frontend       | React 19 + Vite                               |
| Styling        | Tailwind CSS v4                               |
| State          | Redux Toolkit                                 |
| Routing        | React Router v7                               |
| Backend        | Node.js + Express                             |
| Database       | MongoDB + Mongoose                            |
| Authentication | JWT (access + refresh tokens) + bcrypt        |
| API Client     | Axios with interceptors                       |
| Drag & Drop    | @hello-pangea/dnd                             |
| Icons          | Lucide React                                  |
| Notifications  | react-hot-toast                               |

## Features

### Authentication & Security
- User registration and login
- JWT access tokens (15min) stored in sessionStorage
- Refresh tokens stored in HttpOnly cookies with rotation
- Password change and forgot/reset password flow
- Rate limiting on login and password reset endpoints
- Protected routes (frontend) and middleware (backend)
- CORS configuration, Helmet security headers

### Task Management
- Full CRUD operations with validation
- Status: Backlog → To Do → In Progress → In Review → Done
- Priority: Low, Medium, High, Urgent
- Start/due dates, estimated/actual durations
- Tags, descriptions, soft deletion
- Activity history tracking status and priority changes

### Three Synchronized Views
1. **List View** — Tabular display with sortable columns, checkboxes, inline completion toggle, pagination
2. **Section View** — Tasks grouped by status, collapsible sections, task counts
3. **Kanban View** — Drag-and-drop board, per-column task cards, visual status transitions

### SLA Tracking
- Configurable SLA duration per task (in minutes)
- Auto-calculated statuses: On Track, At Risk, Breached, Met
- Configurable at-risk threshold (default: 20% remaining)
- SLA countdown display in task cards and detail view
- Dashboard compliance ring chart with aggregate stats

### Filtering & Search
- Full-text search across title and description (debounced)
- Multi-select filters: status, priority, SLA status
- Date filters: today, this week, overdue, custom ranges
- Tag filtering, sort by multiple fields
- Active filter chips with clear-all
- Server-side filtering for scalable datasets

### Pagination
- Server-side pagination with configurable page size (10/20/50/100)
- Accurate total counts, page numbers, prev/next controls
- Resets to page 1 on filter changes

### Dashboard
- Total/completed/overdue/today task counts
- Status breakdown with progress bars
- Priority distribution grid
- SLA compliance percentage with ring chart
- On Track / At Risk / Breached / Met counts
- Average completion time

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd a

# Install server dependencies
cd server
npm install
cp .env.example .env   # Edit with your MongoDB URI and secrets

# Install client dependencies
cd ../client
npm install
```

### Database Setup

```bash
cd server
npm run seed
```

This creates two test accounts and 18 diverse sample tasks.

### Running the Application

```bash
# Terminal 1 — Start the backend
cd server
npm run dev

# Terminal 2 — Start the frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Test Accounts

| Email              | Password      |
| ------------------ | ------------- |
| john@example.com   | password123   |
| jane@example.com   | password123   |

## API Endpoints

### Auth
| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/auth/register`       | Register new user        |
| POST   | `/api/auth/login`          | Login                    |
| POST   | `/api/auth/logout`         | Logout                   |
| POST   | `/api/auth/refresh`        | Refresh access token     |
| POST   | `/api/auth/forgot-password`| Request password reset   |
| POST   | `/api/auth/reset-password` | Reset password           |
| POST   | `/api/auth/change-password`| Change password          |
| GET    | `/api/auth/me`             | Get current user         |

### Tasks
| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| POST   | `/api/tasks`               | Create task              |
| GET    | `/api/tasks`               | List tasks (paginated)   |
| GET    | `/api/tasks/by-status`     | Tasks grouped by status  |
| GET    | `/api/tasks/:id`           | Get task by ID           |
| PATCH  | `/api/tasks/:id`           | Update task              |
| DELETE | `/api/tasks/:id`           | Soft-delete task         |
| PATCH  | `/api/tasks/:id/status`    | Update task status       |
| PATCH  | `/api/tasks/:id/complete`  | Mark task as done        |
| POST   | `/api/tasks/bulk-update`   | Bulk update tasks        |

### Dashboard & Sections
| Method | Endpoint                   | Description              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/dashboard/stats`     | Dashboard statistics     |
| GET    | `/api/dashboard/sla`       | SLA compliance stats     |
| GET    | `/api/sections`            | List sections            |
| POST   | `/api/sections`            | Create section           |
| PATCH  | `/api/sections/:id`        | Update section           |
| DELETE | `/api/sections/:id`        | Delete section           |

### Query Parameters for `GET /api/tasks`

```
?page=1&limit=20&search=report&status=In+Progress,To+Do&priority=High
&sortBy=dueAt&order=asc&tags=frontend&slaStatus=At+Risk
&dueToday=true&dueThisWeek=true&overdue=true
```

## Project Structure

```
├── server/
│   ├── src/
│   │   ├── config/         # MongoDB connection
│   │   ├── models/         # Mongoose schemas (User, Task, Section)
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # Express routes
│   │   ├── middleware/      # Auth, error handling
│   │   ├── validators/     # Express-validator rules
│   │   ├── utils/          # Response helpers
│   │   ├── seed.js         # Database seeder
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Entry point
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── app/            # Redux store
│   │   ├── components/
│   │   │   ├── common/     # Badges, skeletons, dialogs, pagination
│   │   │   ├── layout/     # Sidebar, TopNav, AppLayout
│   │   │   ├── tasks/      # ListView, SectionView, KanbanView, TaskForm, TaskDetail
│   │   │   └── filters/    # FilterToolbar
│   │   ├── features/       # Redux slices (auth, tasks, sections, dashboard)
│   │   ├── hooks/          # useDebounce, useTheme, useClickOutside
│   │   ├── pages/          # DashboardPage, TasksPage, SettingsPage, AuthPages
│   │   ├── routes/         # Route guards
│   │   ├── services/       # Axios instance + API endpoint functions
│   │   ├── utils/          # Date formatters, SLA helpers, constants
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
```

## Design Decisions

- **sessionStorage for access tokens**: More secure than localStorage; tokens clear on tab close. Refresh tokens use HttpOnly cookies.
- **Server-side SLA calculation**: Ensures consistency across clients. SLA status is recalculated on every read.
- **Soft deletion**: Tasks are marked `isDeleted` rather than removed, preserving audit trails.
- **Aggregation pipeline for tasks**: Uses MongoDB aggregation for priority sorting and user population.
- **Kanban per-column loading**: Each status column fetches independently with its own pagination.
- **AT_RISK_THRESHOLD**: Configurable via environment variable (default 20%).

## License

MIT
#   T o d o - A p p - C o m h a r d  
 