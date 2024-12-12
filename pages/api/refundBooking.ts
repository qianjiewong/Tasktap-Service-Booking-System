import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { bookingId, captureId } = req.body;

  if (!bookingId || !captureId) {
    return res.status(400).json({ error: 'Booking ID and PayPal Capture ID are required.' });
  }

  try {
    // PayPal API credentials
    const clientId = 'Aa0UdlWw06CH8UsVh61BIsbbmf3ippSsyVir6QUW5jxiQgovziHo-tfMIhDVJYc0upChriQE3MK3wHRP';
    const clientSecret = 'EEocyA5y6WbK1s8oM6njWXgRPOVT5YZaaqOEe9Gh5vAAKhLKN4ABH06qWlSyEW5HUV1nu1SAQ5M4QkkA';
    const baseUrl = 'https://api-m.sandbox.paypal.com';

    // Step 1: Obtain PayPal Access Token
    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const { access_token } = await authResponse.json();
    
    if (!access_token) {
      throw new Error('Failed to obtain PayPal access token.');
    }

    // Step 2: Issue Refund
    const refundResponse = await fetch(`${baseUrl}/v2/payments/captures/${captureId}/refund`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        note_to_payer: 'Your booking has been canceled, and the payment refunded.',
      }),
    });

    const refundResult = await refundResponse.json();
    if (!refundResponse.ok) {
      throw new Error(refundResult.message || 'Failed to process refund.');
    }

    // Step 3: Update Booking Status in Database
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' },
    });

    // Step 4: Send Response
    res.status(200).json({
      message: 'Booking canceled and refund processed successfully.',
      refundResult,
      booking: updatedBooking,
    });
  } catch (error: unknown) {
    console.error('Error processing refund or updating booking status:', error);
    res.status(500).json({ error: (error as Error).message || 'Internal server error' });
  }
}
