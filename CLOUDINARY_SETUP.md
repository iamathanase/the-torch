# Cloudinary Setup for Profile Pictures

## Problem
Profile pictures are not persisting because Cloudinary environment variables are not set on Vercel.

## Solution

### Step 1: Add Environment Variables to Vercel Backend

1. Go to https://vercel.com/adelard-sketchs-projects/thetorchbackend
2. Click on **Settings** tab
3. Click on **Environment Variables** in the left sidebar
4. Add these three variables:

```
CLOUDINARY_CLOUD_NAME = dof93vpjk
CLOUDINARY_API_KEY = 656895227728792
CLOUDINARY_API_SECRET = F65b4q3i-Erwo4SqEu2evkpexHw
```

5. Make sure to select **Production**, **Preview**, and **Development** for each variable
6. Click **Save**

### Step 2: Redeploy

1. Go to **Deployments** tab
2. Click the **...** menu on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (1-2 minutes)

### Step 3: Test

1. Go to https://the-torch.vercel.app/dashboard/settings
2. Upload a profile picture
3. Check browser console for logs:
   - Should see "✅ Cloudinary upload successful"
   - Should see the Cloudinary URL (starts with https://res.cloudinary.com/)
4. Refresh the page - image should still be there
5. Logout and login - image should still be there

## How It Works

1. User selects image in Settings
2. Image is sent to backend as FormData
3. Backend receives image buffer
4. Backend uploads to Cloudinary
5. Cloudinary returns secure URL
6. URL is saved to MongoDB user profile
7. Frontend updates localStorage and reloads page
8. Image displays from Cloudinary URL everywhere in app

## Fallback

If Cloudinary fails (e.g., credentials not set), the system will:
- Convert small images (<500KB) to base64
- Store base64 in database
- Display base64 image (works but not ideal)

## Troubleshooting

### Images not showing after upload
- Check Vercel environment variables are set
- Check browser console for error messages
- Check Vercel deployment logs for Cloudinary errors

### "Cloudinary is not configured" error
- Environment variables are missing on Vercel
- Follow Step 1 above to add them

### Images disappear after page reload
- Cloudinary upload is failing
- Check Vercel logs for errors
- Verify environment variables are correct

### Base64 images showing instead of Cloudinary URLs
- Cloudinary credentials are wrong
- Check the values match exactly
- Redeploy after fixing

## Verification

After setup, check Vercel logs for these messages:
```
✅ Cloudinary upload successful: https://res.cloudinary.com/...
✅ Profile picture saved to database for user: ...
```

If you see:
```
❌ Cloudinary upload failed: ...
⚠️  Using base64 fallback
```

Then Cloudinary is not properly configured.
