import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Received report issue:', body);

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: `Neta Samachar Issue: ${body.issueType}`,
      text: `Issue Type: ${body.issueType}\nPolitician ID: ${body.politicianId}\nDetails: ${body.details}`,
    });

    return NextResponse.json({ success: true, message: 'We\'ve noted this — full ticketing is coming soon.' });
  } catch (error) {
    console.error('Error in /api/report-issue:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
