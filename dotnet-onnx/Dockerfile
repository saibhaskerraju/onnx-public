FROM mcr.microsoft.com/dotnet/sdk:8.0 AS dev

WORKDIR /app

COPY *.csproj ./
# Restore as distinct layers
RUN dotnet restore

# Copy everything
COPY . ./