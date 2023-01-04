using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers;

public class FollowToggle {
    public class Command : IRequest<Result<Unit>>{
        public string? TargetUserName {get; set;}
    }

    public class Handler : IRequestHandler<Command, Result<Unit>?>
    {
        private readonly DataContext dataContext;
        private readonly IUserAccessor userAccessor;

        public Handler(DataContext dataContext, IUserAccessor userAccessor)
        {
            this.dataContext = dataContext;
            this.userAccessor = userAccessor;
        }

        public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken)
        {
            var observer = await dataContext.Users.FirstOrDefaultAsync(x => 
                x.UserName == userAccessor.GetUsername());
            
            var target = await dataContext.Users.FirstOrDefaultAsync(x => 
                x.UserName == request.TargetUserName);
            
            if (target == null) return null;

            var following = await dataContext.UserFollowings!.FindAsync(observer!.Id, target.Id);

            if (following == null){
                following = new UserFollowing{
                    Observer = observer,
                    Target = target
                };

                dataContext.UserFollowings.Add(following);
            }else{
                dataContext.UserFollowings.Remove(following);
            }

            var succes = await dataContext.SaveChangesAsync()> 0;

            if(succes) return Result<Unit>.Success(Unit.Value);
            return Result<Unit>.Failure("Failed to update following");

        }
    }
}