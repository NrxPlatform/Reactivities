using MediatR;
using Application.Core;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Application.Interfaces;

namespace Application.Activities;
public class List{
    public class Query: IRequest<Result<PagedList<ActivityDto>>> {
        public ActivityParams? Params { get; set; }
    }
    public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>{
        private readonly DataContext _context;
        private readonly IMapper mapper;
        private readonly IUserAccessor userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor){
            _context = context;
            this.mapper = mapper;
            this.userAccessor = userAccessor;
        }
        public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken){
            var query = _context.Activities!
                .Where(d => d.Date >= request.Params!.StartDate)
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, 
                    new{ currentUsername = userAccessor.GetUsername()})
                .AsQueryable();
            if (request.Params!.IsGoing && !request.Params.IsHost){
                query = query.Where(x => x.Attendees.Any(a => a.Username == userAccessor.GetUsername()));
            }

            if (request.Params.IsHost && !request.Params.IsGoing){
                query = query.Where(x => x.HostUserName == userAccessor.GetUsername());
            }
            return Result<PagedList<ActivityDto>>.Success(
                await PagedList<ActivityDto>.CreateAsync(query, request.Params!.PageNumber,
                    request.Params!.PageSize));
        }

    }
}