using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles;

public class ListActivities {
    public class Query: IRequest<Result<List<UserActivityDto>>>{
        public string? Username {get; set;}
        public string? Predicate {get; set;}
    }

    public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
    {
        private readonly DataContext dataContext;
        private readonly IMapper mapper;

        public Handler(DataContext dataContext, IMapper mapper)
        {
            this.dataContext = dataContext;
            this.mapper = mapper;
        }

        public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
        {
            var query = dataContext.ActivityAttendees!.Where(u => u.AppUser!.UserName == request.Username)
                .OrderBy(a => a.Activity!.Date).ProjectTo<UserActivityDto>(mapper.ConfigurationProvider)
                .AsQueryable();

            query = request.Predicate switch{
                "past" => query.Where(a => a.Date <= DateTime.Now),
                "hosting" => query.Where(a => a.HostUsername == request.Username),
                _ => query.Where(a => a.Date >= DateTime.Now)
            };

            var activites = await query.ToListAsync();
            return Result<List<UserActivityDto>>.Success(activites);
        }
    }
}