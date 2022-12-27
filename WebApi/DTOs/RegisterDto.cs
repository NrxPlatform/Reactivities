using System.ComponentModel.DataAnnotations;

namespace WebApi.DTOs;
public record RegisterDto{
    [Required]
    [EmailAddress]
    public string? Email {get; init;}
    [Required]
    [RegularExpression("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$", ErrorMessage = "Password must be complex")]
    public string? Password {get; init;}
    [Required]
    public string? DisplayName {get; init;}
    [Required]
    public string? Username {get; init;}
}