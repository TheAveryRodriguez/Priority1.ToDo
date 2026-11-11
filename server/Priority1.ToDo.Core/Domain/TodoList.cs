using System.ComponentModel.DataAnnotations;

namespace Priority1.ToDo.Core.Domain;

public class TodoList : EntityBase
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public List<Todo> Todos { get; set; } = new();
}
