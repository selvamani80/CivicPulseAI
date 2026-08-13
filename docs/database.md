# Database Schema & PostGIS Specifications

CivicPulse AI uses a relational schema designed for spatial lookups and time-series aggregation.

## Core Schema Tables

### `incident_reports`
- `id` (UUID, Primary Key)
- `description` (TEXT)
- `language` (VARCHAR(10)) - 'en', 'ta', 'tanglish'
- `category` (VARCHAR(50)) - 'waterlogging', 'road_damage', 'drainage_blockage', etc.
- `severity` (VARCHAR(20)) - 'low', 'medium', 'high', 'critical'
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `geom` (GEOMETRY(Point, 4326)) - PostGIS Point
- `ward` (VARCHAR(100))
- `image_url` (TEXT)
- `ai_confidence` (FLOAT)
- `status` (VARCHAR(30))
- `created_at` (TIMESTAMP)

### `incident_clusters`
- `id` (UUID, Primary Key)
- `category` (VARCHAR(50))
- `centroid` (GEOMETRY(Point, 4326))
- `report_count` (INTEGER)
- `suggested_severity` (VARCHAR(20))
- `status` (VARCHAR(30))

### `predictions`
- `id` (UUID, Primary Key)
- `category` (VARCHAR(50))
- `latitude` (DOUBLE PRECISION)
- `longitude` (DOUBLE PRECISION)
- `risk_probability` (FLOAT)
- `expected_time_window` (VARCHAR(50))
- `confidence` (FLOAT)
- `model_version` (VARCHAR(50))
- `actual_outcome` (VARCHAR(30))
