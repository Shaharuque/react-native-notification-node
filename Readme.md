# Notification API Documentation

## Base URL
`https://react-native-notification-node.onrender.com`

## Endpoints

### 1. Create a Notification
**Endpoint:** `POST /notifications`  
**Method:** POST  
**Payload:**
```json
{
  "title": "New Notification form 2",
  "message": "Testing new notification",
  "type": "form",
  "isRead": false
}
```

**Required Fields:**
- `title` (string) - The notification title

**Optional Fields:**
- `message` (string) - The notification message
- `type` (string) - The notification type (defaults to "default")
- `userId` (string) - User ID for targeted notifications
- `payload` (object) - Additional data
- `isRead` (boolean) - Read status

### 2. Get All Notifications
**Endpoint:** `GET /notifications`  
**Method:** GET  
**Query Parameters:**
- `status` (optional) - Filter by status: `all`, `read`, or `unread`
- `userId` (optional) - Filter by specific user ID
- `page` (optional) - Page number for pagination (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**Examples:**
```
GET /notifications
GET /notifications?status=unread&userId=user123
GET /notifications?page=2&limit=10
```

**Response includes pagination:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 3. Mark Notification as Read/Unread
**Endpoint:** `PATCH /notifications/:id/read`  
**Method:** PATCH  
**Payload:**
```json
{
  "isRead": true
}
```

**Parameters:**
- `id` - Notification ID in the URL path
- `isRead` (boolean) - Set to true for read, false for unread

### 4. Mark All Notifications as Read
**Endpoint:** `PATCH /notifications/mark-all-read`  
**Method:** PATCH  
**Query Parameters:**
- `userId` (optional) - Mark all notifications as read for specific user

**Examples:**
```
PATCH /notifications/mark-all-read
PATCH /notifications/mark-all-read?userId=user123
```

### 5. Clear All Notifications
**Endpoint:** `DELETE /notifications`  
**Method:** DELETE  
**Description:** Deletes all notifications from the system

## WebSocket Events

The API also supports real-time updates via WebSocket:

- `new-notification` - Emitted when a new notification is created
- `notification-read` - Emitted when a notification's read status changes
- `mark-all-read` - Emitted when all notifications are marked as read

## Notes

- All timestamps are automatically managed
- Notifications are sorted by creation date (newest first)
- User-specific notifications are sent to user-specific rooms
- Global notifications are broadcast to all connected clients