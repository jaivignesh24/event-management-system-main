/**
 * EmailJS Email Service for Aurora Fest Admin Console
 * ====================================================
 * This service uses EmailJS to send real emails from the browser.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to https://www.emailjs.com/ and sign up (FREE plan allows 200 emails/month).
 * 2. Create an Email Service (Gmail recommended): Dashboard > Email Services > Add New Service.
 * 3. Copy your "Service ID" and paste it as EMAILJS_SERVICE_ID below.
 * 4. Create an Email Template: Dashboard > Email Templates > Create New Template.
 *    Use these template variables:
 *      - {{to_name}}        : Recipient's name
 *      - {{to_email}}       : Recipient's email address
 *      - {{event_name}}     : Name of the event
 *      - {{cert_type}}      : Certificate type (Winner, Runner Up, etc.)
 *      - {{cert_id}}        : Credential ID
 *      - {{date_issued}}    : Date the certificate was issued
 *      - {{cert_url}}       : URL to view/print the certificate
 *      - {{from_name}}      : Sender name (e.g., Jaivignesh)
 * 5. Copy your "Template ID" and paste it as EMAILJS_TEMPLATE_ID below.
 * 6. Go to Account > API Keys, copy your Public Key and paste as EMAILJS_PUBLIC_KEY below.
 */

// ==========================================
// EMAILJS CREDENTIALS — Aurora Fest Console
// ==========================================
export const EMAILJS_SERVICE_ID = 'service_n14wxl4';
export const EMAILJS_TEMPLATE_ID = 'template_59lpomv';
export const EMAILJS_PUBLIC_KEY = 'hgYFtnGatjarTI3M2';
// ==========================================

/**
 * Sends a single certificate email via EmailJS.
 * @param {Object} params - Email parameters
 * @param {string} params.toName - Recipient's name
 * @param {string} params.toEmail - Recipient's email address
 * @param {string} params.eventName - Name of the event
 * @param {string} params.certType - Certificate type (Winner, Runner Up, Participation, etc.)
 * @param {string} params.certId - Unique credential ID
 * @param {string} params.dateIssued - Date certificate was issued
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendCertificateEmail = async ({ toName, toEmail, eventName, certType, certId, dateIssued }) => {
  const certUrl = `${window.location.origin}/certificate?certId=${encodeURIComponent(certId)}&name=${encodeURIComponent(toName)}&event=${encodeURIComponent(eventName)}&type=${encodeURIComponent(certType)}&date=${encodeURIComponent(dateIssued)}`;

  const templateParams = {
    to_name: toName,
    to_email: toEmail,
    event_name: eventName,
    cert_type: certType,
    cert_id: certId,
    date_issued: dateIssued,
    cert_url: certUrl,
    from_name: 'Jaivignesh – Aurora Academic Affairs'
  };

  try {
    const emailjs = (await import('@emailjs/browser')).default;
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
    return { success: true, message: 'Email delivered successfully.' };
  } catch (error) {
    console.error('EmailJS error:', error);
    return {
      success: false,
      message: error?.text || error?.message || 'SMTP connection failed. Check your EmailJS credentials.'
    };
  }
};
