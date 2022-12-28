using MediatR;
using Application.Core;
using Domain;
using Persistence;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;

namespace Application.Activities;
public class List{
    public class Query: IRequest<Result<List<ActivityDto>>> {}
    public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>{
        private readonly DataContext _context;
        private readonly IMapper mapper;

        public Handler(DataContext context, IMapper mapper){
            _context = context;
            this.mapper = mapper;
        }
        public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken){
            var activities = await _context.Activities!
                .ProjectTo<ActivityDto>(mapper.ConfigurationProvider).ToListAsync();
            return Result<List<ActivityDto>>.Success(activities);
        }

    }
}