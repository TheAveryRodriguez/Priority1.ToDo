using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class UpdateTodoListRequest
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    public TodoList ToModel(int id)
    {
        return new TodoList
        {
            Id = id,
            Name = Name.Trim()
        };
    }
}
