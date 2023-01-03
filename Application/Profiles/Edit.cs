using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class Edit {
    public class Command : IRequest<Result<Unit>>{
        public string? DisplayName {get; set;}
        public string? Bio {get; set;}
    }

    public class CommandValidator : AbstractValidator<Command>{
        public CommandValidator(){
            RuleFor(x => x.DisplayName).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<Unit>?>{
        private readonly DataContext dataContext;
        private readonly IUserAccessor userAccessor;

        public Handler(DataContext dataContext,IUserAccessor userAccessor){
            this.dataContext = dataContext;
            this.userAccessor = userAccessor;
        }

        public async Task<Result<Unit>?> Handle(Command request, CancellationToken cancellationToken){
            var user = await dataContext.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());
            if (user == null) return null;
            user.Bio = request.Bio ?? user.Bio;
            user.DisplayName = request.DisplayName ?? user.DisplayName;

            // dataContext.Entry(user).State = EntityState.Modified;

            var success = await dataContext.SaveChangesAsync() > 0;
            if (success) return Result<Unit>.Success(Unit.Value);
            return Result<Unit>.Failure("Problem updating profile");
        }   
    }



}