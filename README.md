# Assignment 1 - Task Manager

A full-stack task management application built with .NET 8 and React + TypeScript.

## 🎯 Features Implemented

### Core Features
- ✅ Display list of tasks
- ✅ Add new tasks with description
- ✅ Mark tasks as completed/uncompleted
- ✅ Delete tasks
- ✅ RESTful API with .NET 8
- ✅ In-memory data storage
- ✅ React + TypeScript frontend
- ✅ Axios for API integration
- ✅ React Hooks for state management

### Enhancements
- ✅ Task filtering (All / Active / Completed)
- ✅ Modern, responsive design with gradient background
- ✅ LocalStorage support for offline mode
- ✅ Automatic fallback to offline mode if backend is unavailable
- ✅ Clean and intuitive user interface

## 🛠️ Tech Stack

### Backend
- .NET 8 Core
- ASP.NET Core Web API
- In-memory data storage
- Swagger for API documentation
- CORS enabled for frontend integration

### Frontend
- React 18
- TypeScript
- Axios for HTTP requests
- CSS3 with custom styling
- LocalStorage for data persistence

## 📁 Project Structure

```
TaskManager/
├── Backend/
│   └── TaskManagerAPI/
│       ├── Program.cs          # Main API code with endpoints
│       └── TaskManagerAPI.csproj
└── frontend/
    ├── src/
    │   ├── App.tsx            # Main React component
    │   ├── App.css            # Styles
    │   └── index.tsx
    └── package.json
```

## 🚀 How to Run

### Prerequisites
- .NET 8 SDK
- Node.js (v18 or higher)

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd TaskManager/Backend/TaskManagerAPI
   ```

2. Run the backend:
   ```bash
   dotnet run
   ```

   The API will start on `http://localhost:5089` 

3. Access Swagger documentation at: `http://localhost:5089/swagger`

### Frontend Setup

1. Open a new terminal and navigate to frontend folder:
   ```bash
   cd TaskManager/frontend
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Update API URL if needed:
   - Open `src/App.tsx`
   - Update `API_URL` constant to match your backend port

4. Run the frontend:
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/{id}` - Get a specific task
- `POST /api/tasks` - Create a new task
  ```json
  {
    "description": "Task description"
  }
  ```
- `PUT /api/tasks/{id}` - Update a task
  ```json
  {
    "description": "Updated description",
    "isCompleted": true
  }
  ```
- `DELETE /api/tasks/{id}` - Delete a task

## 💡 Usage

1. **Add a task**: Type in the input field and click "Add Task"
2. **Mark as complete**: Click the checkbox next to a task
3. **Delete a task**: Click the "Delete" button
4. **Filter tasks**: Use "All", "Active", or "Completed" buttons
5. **Offline mode**: Tasks are automatically saved to browser's localStorage

## 🎨 Features Showcase

### Responsive Design
- Beautiful purple gradient background
- Clean white card interface
- Hover effects on buttons and tasks
- Mobile-friendly layout

### Smart State Management
- Real-time updates
- Optimistic UI updates
- Error handling with user-friendly messages
- Automatic offline mode detection

### Data Persistence
- **Online mode**: Data stored in backend API (in-memory)
- **Offline mode**: Data stored in browser localStorage
- Automatic mode switching based on backend availability


## 📝 Notes
- Backend uses in-memory storage, so data resets when server restarts
- Frontend automatically switches to localStorage if backend is unavailable
- All tasks are stored locally in the browser when in offline mode

