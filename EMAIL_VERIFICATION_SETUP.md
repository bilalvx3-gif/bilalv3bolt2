# Email Verification Setup Guide

## Current Issue
The email verification system is not working because Supabase needs to be configured with an email service provider.

## Required Steps to Fix Email Verification

### 1. Configure Email Service Provider in Supabase

#### Option A: Use Supabase Built-in Email (Limited)
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Settings
3. Under "Email Templates", ensure "Enable email confirmations" is checked
4. Note: This uses Supabase's default email service with limitations

#### Option B: Use Custom Email Provider (Recommended)
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Settings
3. Under "SMTP Settings", configure one of these providers:

**SendGrid Configuration:**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Username: apikey
SMTP Password: [Your SendGrid API Key]
```

**Mailgun Configuration:**
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP Username: [Your Mailgun Username]
SMTP Password: [Your Mailgun Password]
```

**Gmail Configuration:**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Username: [Your Gmail Address]
SMTP Password: [Your App Password]
```

### 2. Update Environment Variables

Add these to your `.env` file:
```env
# Email Service Configuration
VITE_EMAIL_SERVICE_PROVIDER=sendgrid  # or mailgun, gmail
VITE_EMAIL_FROM=noreply@yourdomain.com
```

### 3. Configure Email Templates

In Supabase Dashboard → Authentication → Email Templates:

**Confirm Signup Template:**
```html
<h2>Welcome to UmrahBooking!</h2>
<p>Please confirm your email address by clicking the link below:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email Address</a>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

**Reset Password Template:**
```html
<h2>Password Reset Request</h2>
<p>Click the link below to reset your password:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>If you didn't request a password reset, you can safely ignore this email.</p>
```

### 4. Test Email Configuration

1. Create a test user account
2. Check if verification email is received
3. Verify the email link works correctly
4. Check Supabase logs for any email delivery errors

### 5. Common Issues and Solutions

**Issue: Emails not being sent**
- Check SMTP credentials
- Verify email service provider settings
- Check Supabase logs for errors

**Issue: Emails going to spam**
- Configure SPF and DKIM records
- Use a reputable email service provider
- Avoid spam trigger words

**Issue: Email links not working**
- Verify `emailRedirectTo` URL is correct
- Check if the redirect URL is allowed in Supabase settings
- Ensure the frontend route exists

### 6. Alternative Solutions

If email verification continues to fail:

1. **Use Phone Verification Instead:**
   - Implement SMS verification using Twilio or similar service
   - Update the signup flow to use phone verification

2. **Manual Email Verification:**
   - Create an admin panel to manually verify users
   - Send verification emails manually through your own email service

3. **Skip Email Verification (Development Only):**
   - Disable email confirmation requirement in Supabase
   - Note: This is NOT recommended for production

## Testing the Fix

After implementing the email service provider:

1. Clear browser cache and cookies
2. Try creating a new user account
3. Check your email inbox (and spam folder)
4. Click the verification link
5. Verify the user is redirected to the phone verification page

## Monitoring and Maintenance

1. **Regular Checks:**
   - Monitor email delivery rates
   - Check Supabase logs for email errors
   - Test signup flow monthly

2. **Email Service Provider:**
   - Monitor API usage and limits
   - Keep SMTP credentials secure
   - Have backup email providers ready

## Security Considerations

1. **Environment Variables:**
   - Never commit SMTP credentials to version control
   - Use strong, unique passwords for email services
   - Rotate credentials regularly

2. **Rate Limiting:**
   - Implement rate limiting on signup endpoints
   - Prevent email abuse and spam

3. **Email Validation:**
   - Validate email format on frontend and backend
   - Implement email domain validation if needed

## Support

If you continue to experience issues:

1. Check Supabase documentation: https://supabase.com/docs/guides/auth/auth-email
2. Review Supabase logs for detailed error messages
3. Contact your email service provider for SMTP issues
4. Check Supabase community forums for similar issues 