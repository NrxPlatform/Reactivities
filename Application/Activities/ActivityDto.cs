using Application.Profiles;
using Domain;

namespace Application.Activities;

public record ActivityDto{
    public Guid Id {get; init;}
    public string? Title {get; init;}
    public DateTime Date {get; init;}
    public string? Description {get; init;}
    public string? Category {get; init;}
    public string? City {get; init;}
    public string? Venue {get; init;}
    public string? HostUserName {get; init;}
    public bool IsCancelled {get; set;}
    public ICollection<AttendeeDto> Attendees {get; init;} = new List<AttendeeDto>();
}