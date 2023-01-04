using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments;

public class Create{
    public class Command :IRequest<Result<CommentDto>>{
        public string? Body {get; set;}
        public Guid ActivityId {get; set;}
    }

    public class CommandValidator : AbstractValidator<Command>{
        public CommandValidator(){
            RuleFor(x => x.Body).NotEmpty();
        }
    }

    public class Handler : IRequestHandler<Command, Result<CommentDto>?>
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;
        private readonly IUserAccessor userAccessor;

        public Handler(DataContext dataContext, IMapper mapper, IUserAccessor userAccessor)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
            this.userAccessor = userAccessor;
        }

        public async Task<Result<CommentDto>?> Handle(Command request, CancellationToken cancellationToken)
        {
            var activity = await dataContext.Activities!.FindAsync(request.ActivityId);

            if (activity == null) return null;

            var user = await dataContext.Users.Include(x => x.Photos).FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

            var comment = new Comment{
                Author = user,
                Activity = activity,
                Body = request.Body
            };

            dataContext.Comments!.Add(comment);

            var result = await dataContext.SaveChangesAsync() > 0;

            if (result) return Result<CommentDto>.Success(mapper.Map<CommentDto>(comment));
            return Result<CommentDto>.Failure("Problem creating comment");
        
        }
    }
}