using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// Add CORS to allow frontend to connect
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Enable Swagger for testing
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

// In-memory storage for tasks
var tasks = new List<TaskItem>();
var nextId = 1;

// GET: Get all tasks
app.MapGet("/api/tasks", () =>
{
    return Results.Ok(tasks);
});

// GET: Get a specific task
app.MapGet("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task == null)
        return Results.NotFound();
    
    return Results.Ok(task);
});

// POST: Create a new task
app.MapPost("/api/tasks", ([FromBody] CreateTaskRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.Description))
        return Results.BadRequest("Description is required");

    var task = new TaskItem
    {
        Id = nextId++,
        Description = request.Description,
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow
    };

    tasks.Add(task);
    return Results.Created($"/api/tasks/{task.Id}", task);
});

// PUT: Update a task (mark as completed/uncompleted)
app.MapPut("/api/tasks/{id}", (int id, [FromBody] UpdateTaskRequest request) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task == null)
        return Results.NotFound();

    if (!string.IsNullOrWhiteSpace(request.Description))
        task.Description = request.Description;
    
    task.IsCompleted = request.IsCompleted;

    return Results.Ok(task);
});

// DELETE: Delete a task
app.MapDelete("/api/tasks/{id}", (int id) =>
{
    var task = tasks.FirstOrDefault(t => t.Id == id);
    if (task == null)
        return Results.NotFound();

    tasks.Remove(task);
    return Results.NoContent();
});

app.Run();

// Models
public class TaskItem
{
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateTaskRequest
{
    public string Description { get; set; } = string.Empty;
}

public class UpdateTaskRequest
{
    public string Description { get; set; } = string.Empty;
    public bool IsCompleted { get; set; }
}