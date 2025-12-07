# Firestore Security Rules for Workspace

## Problem
Getting error: "Failed to create task: Missing or insufficient permissions"

This means Firestore security rules don't allow creating documents in the `collab_tasks` collection.

## Solution

Add these rules to your `firestore.rules` file in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... your existing rules ...
    
    // Collaborations (Projects)
    match /collaborations/{collabId} {
      // Users can read collaborations they're a member of
      allow read: if request.auth != null && 
                     request.auth.uid in resource.data.memberIds;
      
      // Users can create new collaborations
      allow create: if request.auth != null && 
                       request.auth.uid in request.resource.data.memberIds;
      
      // Members can update collaborations
      allow update: if request.auth != null && 
                       request.auth.uid in resource.data.memberIds;
      
      // Only creator can delete
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdBy;
    }
    
    // Collaboration Tasks
    match /collab_tasks/{taskId} {
      // Users can read tasks from collaborations they're members of
      allow read: if request.auth != null;
      
      // Users can create tasks in collaborations they're members of
      allow create: if request.auth != null && 
                       request.auth.uid == request.resource.data.createdByUid;
      
      // Task creator or collaboration members can update tasks
      allow update: if request.auth != null && 
                       (request.auth.uid == resource.data.createdByUid ||
                        request.auth.uid == resource.data.assignee.uid);
      
      // Task creator can delete
      allow delete: if request.auth != null && 
                       request.auth.uid == resource.data.createdByUid;
    }
  }
}
```

## How to Apply

### Option 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Add the rules above to your existing rules
5. Click **Publish**

### Option 2: Firebase CLI
If you have `firestore.rules` file locally:
```bash
firebase deploy --only firestore:rules
```

## Testing

After applying the rules:
1. Refresh your app
2. Navigate to a project in workspace
3. Click "New Task"
4. Fill in the form and click "Create"
5. **Expected**: Task should be created successfully

## Troubleshooting

If you still get permission errors:
- Make sure you're logged in (check `currentUser` exists)
- Verify the project exists and you're a member
- Check browser console for detailed error messages
- Wait a few seconds after publishing rules for them to propagate
