#!/bin/bash
# Deploy Supabase Edge Function for admin notifications

set -e

echo "🚀 Supabase Edge Function Deployment Helper"
echo "==========================================="
echo ""
echo "This script will deploy the admin-notify Edge Function."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it with:"
    echo "   npm install -g supabase"
    exit 1
fi

# Get project ID
echo "📋 Enter your Supabase project ID (from https://app.supabase.com):"
read -p "   Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Project ID is required"
    exit 1
fi

# Get Resend API key
echo ""
echo "🔑 Enter your Resend API key (from https://resend.com/api-keys):"
read -sp "   API Key: " RESEND_API_KEY
echo ""

if [ -z "$RESEND_API_KEY" ]; then
    echo "❌ Resend API key is required"
    exit 1
fi

# Get admin email
echo ""
echo "📧 Enter the admin email address for notifications:"
read -p "   Email: " ADMIN_EMAIL

if [ -z "$ADMIN_EMAIL" ]; then
    echo "❌ Admin email is required"
    exit 1
fi

# Get allowed origins (optional)
echo ""
echo "🌐 Enter allowed origins (comma-separated, e.g., https://anuragverma-author.vercel.app):"
read -p "   Origins (press Enter to skip): " ADMIN_ORIGINS

echo ""
echo "⏳ Deploying Edge Function..."

# Deploy function
supabase functions deploy admin-notify --project-id "$PROJECT_ID"

echo ""
echo "✅ Edge Function deployed!"
echo ""
echo "⏳ Setting environment secrets..."

# Build secrets command
SECRETS_CMD="supabase secrets set --project-id $PROJECT_ID RESEND_API_KEY='$RESEND_API_KEY' ADMIN_NOTIFY_TO_EMAIL='$ADMIN_EMAIL'"

if [ -n "$ADMIN_ORIGINS" ]; then
    SECRETS_CMD="$SECRETS_CMD ADMIN_NOTIFY_ALLOWED_ORIGINS='$ADMIN_ORIGINS'"
fi

# Set secrets
eval "$SECRETS_CMD"

echo ""
echo "✅ Secrets configured!"
echo ""
echo "📝 Next steps:"
echo "1. Get your Edge Function URL from Supabase dashboard"
echo "   - Go to Project Settings → Edge Functions"
echo "   - Copy the URL for admin-notify function"
echo ""
echo "2. Set Vercel environment variable:"
echo "   - Go to Vercel Project Settings → Environment Variables"
echo "   - Add: VITE_ADMIN_NOTIFICATION_ENDPOINT=<your-function-url>"
echo ""
echo "3. Redeploy production:"
echo "   npm run deploy"
echo ""
echo "🎉 Done!"
