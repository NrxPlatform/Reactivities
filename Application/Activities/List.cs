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
    public class Query: IRequest<Result<List<ActivityDto>>> {}
    public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>{
        private readonly DataContext _context;
        private readonly IMapper mapper;
        private readonly IUserAccessor userAccessor;

        public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor){
            _context = context;
            this.mapper = mapper;
            this.userAccessor = userAccessor;
        }
        public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken){
            var activities = await _context.Activities!
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, 
                    new{ currentUsername = userAccessor.GetUsername()}).ToListAsync();
            return Result<List<ActivityDto>>.Success(activities);
        }

    }
}