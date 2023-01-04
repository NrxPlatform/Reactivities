namespace Application.Activities;

public record AttendeeDto {
    public string? Username {get; init;}
    public string? DisplayName {get; init;}
    public string? Bio {get; init;}
    public string? Image {get; init;}
    public bool Following {get; set;}
    public int FollowersCount {get; set;}
    public int FollowingCount {get; set;}
}