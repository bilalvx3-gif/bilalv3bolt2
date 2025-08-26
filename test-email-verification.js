// Test Script for Email Verification Setup
// Run this in your browser console or as a Node.js script

const testEmailVerification = async () => {
  console.log('🔍 Testing Email Verification Setup...');
  
  // Test 1: Check Environment Variables
  console.log('\n📋 Environment Variables Check:');
  console.log('VITE_SUPABASE_URL:', import.meta.env?.VITE_SUPABASE_URL || 'Not found');
  console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env?.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
  
  // Test 2: Check Supabase Client
  try {
    const { supabase } = await import('./src/lib/supabase.js');
    console.log('\n🔌 Supabase Client Check:');
    console.log('Supabase client created:', !!supabase);
    console.log('Supabase URL:', supabase.supabaseUrl);
    
    // Test 3: Check Auth Configuration
    const { data: { session } } = await supabase.auth.getSession();
    console.log('\n🔐 Auth Configuration Check:');
    console.log('Current session:', session ? 'Active' : 'None');
    
    // Test 4: Check Email Templates (if accessible)
    try {
      // This would require admin access, but we can test the basic structure
      console.log('\n📧 Email Template Check:');
      console.log('Note: Email templates are configured in Supabase Dashboard');
      console.log('Path: Authentication → Email Templates');
    } catch (error) {
      console.log('Email template check failed (requires admin access)');
    }
    
  } catch (error) {
    console.error('❌ Supabase client test failed:', error);
  }
  
  // Test 5: Check Browser Console for Errors
  console.log('\n🚨 Common Issues to Check:');
  console.log('1. Check browser console for CORS errors');
  console.log('2. Verify Supabase project is active');
  console.log('3. Check if email confirmations are enabled in Supabase');
  console.log('4. Verify SMTP settings if using custom email provider');
  
  // Test 6: Manual Verification Steps
  console.log('\n📝 Manual Verification Steps:');
  console.log('1. Go to Supabase Dashboard → Authentication → Settings');
  console.log('2. Check "Enable email confirmations" is ON');
  console.log('3. Verify SMTP settings if configured');
  console.log('4. Check Email Templates section');
  console.log('5. Test with a real email address');
  
  console.log('\n✅ Email Verification Test Complete!');
};

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  window.testEmailVerification = testEmailVerification;
  console.log('🧪 Test function available as: testEmailVerification()');
} else {
  // Node.js environment
  testEmailVerification().catch(console.error);
} 