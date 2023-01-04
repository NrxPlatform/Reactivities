using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Domain;

namespace Persistence;
public class DataContext : IdentityDbContext<AppUser>
{
    public DataContext(DbContextOptions options): base(options){

    }

    public DbSet<Activity>? Activities {get; set;}
    public DbSet<ActivityAttendee>? ActivityAttendees {get; set;}
    public DbSet<Photo>? Photos {get; set;}
    public DbSet<Comment>? Comments {get; set;}
    public DbSet<UserFollowing>? UserFollowings {get; set;}

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<ActivityAttendee>(x => x.HasKey(aa => new {aa.AppUserId, aa.ActivityId}));
        builder.Entity<ActivityAttendee>().HasOne(u => u.AppUser).WithMany(x => x.Activities).HasForeignKey(x => x.AppUserId);
        builder.Entity<ActivityAttendee>().HasOne(u => u.Activity).WithMany(x => x.Attendees).HasForeignKey(x => x.ActivityId);
        builder.Entity<Comment>().HasOne(c => c.Activity).WithMany(a => a.Comments).OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UserFollowing>(u => {
            u.HasKey(x => new {x.ObserverId, x.TargetId});

            u.HasOne(x => x.Observer)
                .WithMany(x => x.Followings).HasForeignKey(x => x.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);
            
            u.HasOne(x => x.Target).WithMany(x => x.Followers)
                .HasForeignKey(x => x.TargetId).OnDelete(DeleteBehavior.Cascade);
        });
    }
}
