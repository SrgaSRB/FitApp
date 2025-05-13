# 1. Runtime slika (Linux)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 10000

# 2. SDK slika za build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Kopira proj fajlove i restore dependencies
COPY ["Service.csproj", "./"]
RUN dotnet restore "Service.csproj"

# Kopira ostatak koda i builduje
COPY . .
RUN dotnet publish "Service.csproj" -c Release -o /app/publish

# 3. Finalna runtime slika
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://0.0.0.0:10000
ENTRYPOINT ["dotnet", "Service.dll"]
