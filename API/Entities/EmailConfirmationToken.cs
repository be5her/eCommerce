using System.ComponentModel.DataAnnotations;

namespace API.Entities;

public class EmailConfirmationToken
{
    [Key]
    public Guid Token { get; set; }
    public DateTime ExpDate { get; set; }
    public int UserId { get; set; }
}
