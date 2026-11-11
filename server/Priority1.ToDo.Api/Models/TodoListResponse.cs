using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models;

public class TodoListResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public DateTime CreateDate { get; set; }
    public DateTime UpdateDate { get; set; }

    public static TodoListResponse From(TodoList list)
    {
        return new TodoListResponse
        {
            Id = list.Id,
            Name = list.Name,
            CreateDate = list.CreateDate,
            UpdateDate = list.UpdateDate
        };
    }
}
