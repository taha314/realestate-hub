const sendEmail = async (options) => {
    try {
        const BREVO_API_KEY = process.env.BREVO_API_KEY?.trim();
        const senderEmail = process.env.EMAIL_USER?.trim();

        if (!BREVO_API_KEY) {
            console.error('Brevo API key is not set in environment variables');
            throw new Error('Email service is not configured');
        }
        if (!senderEmail) {
            console.error('Email sender address is not set in environment variables');
            throw new Error('Email sender is not configured');
        }

        const data = {
            sender: {
                name: 'Real Estate Platform',
                email: senderEmail
            },
            to: [{
                email: options.email
            }],
            subject: options.subject,
            htmlContent: options.message
        };
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'content-type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if (response.ok) {
            console.log('Email sent successfully:', result.messageId);
        } else {
            console.error('Failed to send email:', result);
            throw new Error(result.message || 'Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw new Error('Error sending email');
    }
};

export default sendEmail;
