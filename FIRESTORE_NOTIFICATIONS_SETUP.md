# Firestore Configuration for Notifications

## Security Rules

Add these rules to your `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... existing rules ...
    
    // Notifications collection
    match /notifications/{notificationId} {
      // Users can only read their own notifications
      allow read: if request.auth != null && resource.data.userUid == request.auth.uid;
      
      // Users can create notifications for themselves
      allow create: if request.auth != null && request.resource.data.userUid == request.auth.uid;
      
      // Users can update/delete their own notifications
      allow update, delete: if request.auth != null && resource.data.userUid == request.auth.uid;
    }
  }
}
```

## Required Composite Index

You need to create a composite index for the notifications query.

### Option 1: Via Firebase Console
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Configure:
   - **Collection ID**: `notifications`
   - **Fields to index**:
     - Field: `userUid`, Order: Ascending
     - Field: `createdAt`, Order: Descending
   - **Query scope**: Collection
4. Click "Create"

### Option 2: Via firestore.indexes.json

Create or update `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "notifications",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "userUid",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Then deploy with:
```bash
firebase deploy --only firestore:indexes
```

### Option 3: Click the Link in Console Error

When you run the app and the query fails, Firebase will log an error with a direct link to create the index. Click that link and it will auto-configure the index for you.

## Testing After Configuration

1. Deploy the security rules and wait for the index to build (usually 1-2 minutes)
2. Navigate to `/notifications` in your app
3. The error should be resolved
4. Test creating a notification by updating your profile
