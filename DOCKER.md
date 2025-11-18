# Web Designer Finder - Docker

## Running with Docker Compose

The easiest way to run the application:

```bash
docker-compose up --build
```

This will:
- Build and start the backend on port 3001
- Build and start the frontend on port 80
- Create a shared network between them

Access the app at: **http://localhost**

## Running Containers Separately

### Backend only:
```bash
cd server
docker build -t designer-finder-backend .
docker run -p 3001:3001 -v $(pwd)/data.json:/app/data.json designer-finder-backend
```

### Frontend only:
```bash
docker build -t designer-finder-frontend .
docker run -p 80:80 designer-finder-frontend
```

## Stopping the containers

```bash
docker-compose down
```

## Data Persistence

Designer data is stored in `server/data.json` and is mounted as a volume, so it persists even when containers restart.
