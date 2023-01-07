FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env
WORKDIR /source
EXPOSE 8080

# copy .csproj and restore as distinct layers
COPY "Reactivities.sln" "Reactivities.sln"
COPY "WebApi/WebApi.csproj" "WebApi/WebApi.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Persistence/Persistence.csproj" "Persistence/Persistence.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"

RUN dotnet restore

# copy everything else build
COPY . .
RUN dotnet publish -c Release -o /app --no-restore

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build-env /app .
ENTRYPOINT ["dotnet", "WebApi.dll"]
