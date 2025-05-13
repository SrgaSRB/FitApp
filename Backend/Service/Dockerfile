# 1. Bazna slika (za runtime)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# 2. SDK slika (za build)
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopira proj fajlove
COPY ["Service.csproj", "./"]
RUN dotnet restore "./Service.csproj"

# Kopira ostatak koda
COPY . .
WORKDIR "/src/"
RUN dotnet build "Service.csproj" -c Release -o /app/build

# 3. Publish u folder /app/publish
FROM build AS publish
RUN dotnet publish "Service.csproj" -c Release -o /app/publish

# 4. Finalna slika (runtime + app)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Service.dll"]
