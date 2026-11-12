using System.ComponentModel.DataAnnotations;
using Priority1.ToDo.Core.Domain;

namespace Priority1.ToDo.Api.Models.Requests;

public class CreateTodoRequest
{
    [Required]
    public string Title { get; set; }

    public bool IsComplete { get; set; }

    public DateOnly? DueDate { get; set; }

    public Todo ToModel(int listId)
    {
        return new Todo
        {
            Title = Title,
            IsComplete = IsComplete,
            TodoListId = listId,
            DueDate = DueDate
        };
    }
}
