# Bangla Taka Converter - Database Documentation

## Overview

The Bangla Taka Converter now includes a **file-based persistent database system** that tracks all currency conversions and maintains a global conversion counter.

## Database Structure

### File Location
- **Database Directory**: `.data/` (in project root)
- **Data File**: `.data/conversions.json`

### Data Schema

```json
{
  "totalConversions": 0,
  "conversions": [
    {
      "id": "conversion_1234567890_abc123def",
      "amount": "1,11,65,500.56",
      "english": "One Crore Eleven Lac Sixty Five Thousand Five Hundred Taka and Fifty Six Paisa",
      "bangla": "এক কোটি এগারো লাখ পঁয়ষট্টি হাজার পাঁচশত টাকা এবং ছাপ্পান্ন পয়সা মাত্র",
      "timestamp": "2026-04-18T19:15:00.000Z"
    }
  ],
  "lastUpdated": "2026-04-18T19:15:00.000Z"
}
```

## API Endpoints

### 1. Get Conversion Count
```
GET /api/conversions/count
```
**Response:**
```json
{
  "success": true,
  "count": 42,
  "timestamp": "2026-04-18T19:15:00.000Z"
}
```

### 2. Increment Counter & Record Conversion
```
POST /api/conversions/increment
Content-Type: application/json

{
  "amount": "1,11,65,500.56",
  "english": "One Crore Eleven Lac Sixty Five Thousand...",
  "bangla": "এক কোটি এগারো লাখ..."
}
```
**Response:**
```json
{
  "success": true,
  "count": 43,
  "timestamp": "2026-04-18T19:15:00.000Z"
}
```

### 3. Get Recent Conversions
```
GET /api/conversions/recent?limit=10
```
**Response:**
```json
{
  "success": true,
  "conversions": [...],
  "count": 10,
  "timestamp": "2026-04-18T19:15:00.000Z"
}
```

### 4. Get Database Statistics
```
GET /api/conversions/stats
```
**Response:**
```json
{
  "success": true,
  "stats": {
    "totalConversions": 42,
    "totalRecords": 42,
    "lastUpdated": "2026-04-18T19:15:00.000Z"
  },
  "timestamp": "2026-04-18T19:15:00.000Z"
}
```

### 5. Reset Counter (Admin)
```
POST /api/conversions/reset
```
**Response:**
```json
{
  "success": true,
  "count": 0,
  "message": "Conversion counter has been reset",
  "timestamp": "2026-04-18T19:15:00.000Z"
}
```

## Features

### ✅ Persistent Storage
- All conversion data is stored in JSON files
- Data persists across server restarts
- No external database required

### ✅ Real-time Counter
- Global conversion counter tracks total conversions
- Frontend polls API every 3 seconds for updates
- Counter increments with each conversion

### ✅ Conversion History
- Last 1000 conversions are stored
- Each record includes timestamp and unique ID
- Supports querying recent conversions

### ✅ Statistics
- Track total conversions over time
- Monitor database size and last update time
- Easy to export for analytics

## Implementation Details

### Backend Files
- **Database Module**: `server/db/fileDb.ts`
  - Handles all file I/O operations
  - Provides database API methods
  - Manages data persistence

- **API Routes**: `server/routes/conversions.ts`
  - Implements REST endpoints
  - Calls database methods
  - Returns JSON responses

### Frontend Integration
- **Home Page**: `client/src/pages/Home.tsx`
  - Fetches counter on mount
  - Polls for updates every 3 seconds
  - Records each conversion to database
  - Displays real-time counter

## Data Persistence

### How It Works
1. User enters an amount and conversion is generated
2. Frontend sends POST request to `/api/conversions/increment`
3. Backend receives request and:
   - Reads current data from `.data/conversions.json`
   - Increments `totalConversions` counter
   - Adds new conversion record with timestamp
   - Writes updated data back to file
4. Frontend receives response and updates counter display

### Storage Limits
- Maximum 1000 recent conversion records stored
- Older records are automatically pruned
- File size typically remains under 500KB

## Deployment Notes

### Production Deployment
When deploying to production:
1. Ensure `.data/` directory is writable by the application
2. Set up regular backups of `.data/conversions.json`
3. Consider implementing data cleanup policies
4. Monitor file size and implement archival if needed

### Scaling Considerations
For high-traffic scenarios:
- Consider migrating to MongoDB (recommended)
- Implement caching layer for counter reads
- Use database clustering for better performance
- Set up automated backups and recovery

## Future Enhancements

### Recommended Upgrades
1. **MongoDB Integration**: Replace file-based system with MongoDB
2. **Analytics Dashboard**: Visualize conversion trends
3. **Export Features**: CSV/PDF export of conversion history
4. **Search & Filter**: Query conversions by date range or amount
5. **User Tracking**: Track conversions per user (requires authentication)

## Troubleshooting

### Counter Not Updating
- Check browser console for API errors
- Verify `/api/conversions/count` endpoint is accessible
- Check `.data/conversions.json` file permissions

### Data Not Persisting
- Ensure `.data/` directory exists and is writable
- Check server logs for write errors
- Verify disk space availability

### Performance Issues
- Monitor `.data/conversions.json` file size
- Consider archiving old records
- Implement caching for frequently accessed data

## Support

For issues or questions about the database system, refer to:
- Backend implementation: `server/db/fileDb.ts`
- API routes: `server/routes/conversions.ts`
- Frontend integration: `client/src/pages/Home.tsx`
