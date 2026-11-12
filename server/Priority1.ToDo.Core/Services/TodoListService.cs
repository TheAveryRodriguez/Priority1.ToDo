using Microsoft.EntityFrameworkCore;
using Priority1.ToDo.Core.Data;
using Priority1.ToDo.Core.Domain;
using Priority1.ToDo.Core.Services.Interfaces;

namespace Priority1.ToDo.Core.Services;

public class TodoListService : ITodoListService
{
    private readonly AppDbContext _context;

    public TodoListService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TodoList>> GetAllAsync(CancellationToken ct = default)
    {
        return await _context.TodoLists
            .OrderBy(l => l.Id)
            .ToListAsync(ct);
    }

    public async Task<TodoList?> GetByIdAsync(int id, CancellationToken ct = default)
    {
        return await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == id, ct);
    }

    public async Task<TodoList> CreateAsync(TodoList listToCreate, CancellationToken ct = default)
    {
        _context.TodoLists.Add(listToCreate);
        await _context.SaveChangesAsync(ct);
        return listToCreate;
    }

    public async Task<TodoList?> UpdateAsync(TodoList listToUpdate, CancellationToken ct = default)
    {
        var list = await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == listToUpdate.Id, ct);
        if (list is null)
        {
            return null;
        }

        list.Name = listToUpdate.Name;

        await _context.SaveChangesAsync(ct);
        return list;
    }

    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var list = await _context.TodoLists.FirstOrDefaultAsync(l => l.Id == id, ct);
        if (list is null)
        {
            return false;
        }

        _context.TodoLists.Remove(list);
        await _context.SaveChangesAsync(ct);
        return true;
    }
}
