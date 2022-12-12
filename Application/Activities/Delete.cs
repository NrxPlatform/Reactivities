using MediatR;
using Persistence;

namespace Application.Activities;

public class Delete{
    public class Command: IRequest{
        public Guid Id {get; set;}
    }

    public class Handler : IRequestHandler<Command>{
        private readonly DataContext _context;
        public Handler(DataContext dataContext){
            _context = dataContext;
        }

        public async Task<Unit> Handle(Command requrest, CancellationToken cancellationToken){
            var activity = await _context.Activities!.FindAsync(requrest.Id);
            _context.Remove(activity!);
            await _context.SaveChangesAsync();
            return Unit.Value;

        }
    }
}