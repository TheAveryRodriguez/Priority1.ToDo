# Priority1.ToDo

A deliberately minimal full-stack TODO application. It is the starting point for a take-home skills exercise: the CRUD basics work end to end, leaving obvious room to add functionality.

- **Backend:** .NET 8 Web API, Entity Framework Core (Code First), SQL Server
- **Frontend:** React (Vite, plain JavaScript)
- **Database:** SQL Server 2022 running in Docker

---

## Prerequisites

| Tool | Notes |
| --- | --- |
| [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) | `dotnet --version` should report 8.x |
| [Node.js](https://nodejs.org/) (18+) | Ships with `npm` |
| [Docker Desktop](https://www.docker.com/products/docker-desktop/) | Runs the SQL Server container |
| `dotnet-ef` CLI tool | Install once: `dotnet tool install --global dotnet-ef` |

Only SQL Server runs in Docker. The API and the React app run **natively** on your machine (`dotnet run` / `npm run dev`).

---

## Getting started

### 1. Start SQL Server

From the repo root:

```bash
docker compose up -d
```

This starts SQL Server 2022 on `localhost:1433` with the SA credentials that the API is already configured to use (see `server/Priority1.ToDo.Api/appsettings.Development.json`). Data is kept in a named Docker volume, so it survives container restarts.

### 2. Apply the database migration

The database schema is created by the checked-in EF migration. It is **not** applied automatically on startup — run it yourself:

```bash
cd server/Priority1.ToDo.Api
dotnet ef database update
```

**Note**: To add and apply new migrations to your local database during development run the below commands from `server/Priority1.ToDo.Api`:

```bash
dotnet ef migrations add < MigrationName > --project ../Priority1.ToDo.Core --startup-project .
dotnet ef database update
```

This creates the `Priority1ToDo` database with the `TodoLists` and `Todos` tables.

### 3. Run the API

From `server/Priority1.ToDo.Api`:

```bash
dotnet run
```

The API listens on **http://localhost:5000**. In Development, **Swagger UI is served at the root**: open http://localhost:5000/ to explore and try the endpoints.

> **macOS note:** port 5000 is sometimes taken by the AirPlay Receiver. If so, run `dotnet run --urls http://localhost:5001` and update the client's API base URL (see below) to match.

### 4. Run the React app

In a second terminal, from `client/`:

```bash
npm i
npm run dev
```

Vite serves the app at **http://localhost:5173**. It talks to the API at `http://localhost:5000` by default.

**Changing the API URL:** it lives in one place — `client/src/api.js` (the `API_BASE_URL` constant). You can also override it without editing code by copying `client/.env.example` to `client/.env` and setting `VITE_API_BASE_URL`.

---

## Application structure

```
Priority1.ToDo/
├── docker-compose.yml            # SQL Server only (API + client run natively)
├── global.json                   # Pins the build to the .NET 8 SDK
├── server/
│   ├── Priority1.ToDo.sln
│   ├── Priority1.ToDo.Api/       # ASP.NET Core Web API (startup application)
│   │   ├── Controllers/          # TodoListsController, TodosController — thin, call into services
│   │   ├── Models/               # Request/response DTOs
│   │   ├── Program.cs            # DI, EF, CORS, Swagger wiring
│   │   └── appsettings*.json     # Connection string (Development matches Docker)
│   └── Priority1.ToDo.Core/      # Class library (referenced by the Api)
│       ├── Domain/               # EF entities (TodoList, Todo)
│       ├── Data/                 # AppDbContext
│       ├── Migrations/           # EF Code First migrations
│       └── Services/             # Business logic (TodoListService, TodoService + interfaces)
└── client/                       # Vite + React app
    └── src/
        ├── api.js                # API base URL + fetch helpers
        ├── App.jsx               # Loads lists and todos, owns state, wires handlers
        └── components/           # ListSidebar, ListItem, AddTodoForm, TodoList, TodoItem
```

### API endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/lists` | List all lists |
| GET | `/lists/{id}` | Get one list |
| POST | `/lists` | Create a list |
| PUT | `/lists/{id}` | Rename a list |
| DELETE | `/lists/{id}` | Delete a list and its todos |
| GET | `/lists/{listId}/todos` | List a list's todos |
| POST | `/lists/{listId}/todos` | Create a todo in a list |
| GET | `/todos/{id}` | Get one todo |
| PUT | `/todos/{id}` | Update a todo (send `dueDate` too, or it's cleared) |
| DELETE | `/todos/{id}` | Delete a todo |

The `TodoList` entity: `Id`, `Name` (required, max 100), `CreateDate`, `UpdateDate`.

The `Todo` entity: `Id`, `Title` (required), `IsComplete` (default `false`), `DueDate` (optional, date only), `TodoListId` (required), `CreateDate` (set on insert), `UpdateDate` (set on insert and every update).

### Notes / intentional simplifications

- No authentication or authorization of any kind.
- CORS is wide open for localhost in Development to keep local dev frictionless.
- Migrations are applied manually (step 2), never on startup.
- Deleting a list deletes its todos (cascade delete).
- Due dates are calendar dates. Sorting and the overdue check happen in the browser, against the user's local date.

