# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy all project files for restore
COPY MiniCloudIDE.Domain/MiniCloudIDE.Domain.csproj MiniCloudIDE.Domain/
COPY MiniCloudIDE.Application/MiniCloudIDE.Application.csproj MiniCloudIDE.Application/
COPY MiniCloudIDE.Infrastructure/MiniCloudIDE.Infrastructure.csproj MiniCloudIDE.Infrastructure/
COPY MiniCloudIDE.API/MiniCloudIDE.API.csproj MiniCloudIDE.API/

RUN dotnet restore MiniCloudIDE.API/MiniCloudIDE.API.csproj

# Copy everything and publish
COPY MiniCloudIDE.Domain/ MiniCloudIDE.Domain/
COPY MiniCloudIDE.Application/ MiniCloudIDE.Application/
COPY MiniCloudIDE.Infrastructure/ MiniCloudIDE.Infrastructure/
COPY MiniCloudIDE.API/ MiniCloudIDE.API/

RUN dotnet publish MiniCloudIDE.API/MiniCloudIDE.API.csproj -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app .
ENV ASPNETCORE_URLS=http://+:5000
EXPOSE 5000
ENTRYPOINT ["dotnet", "MiniCloudIDE.API.dll"]
