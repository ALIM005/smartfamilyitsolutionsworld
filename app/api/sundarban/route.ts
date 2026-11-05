import { NextRequest, NextResponse } from 'next/server';


// Type interface for order data
interface CourierRequestBody {
  recipientName: string;
  address: string;
  phone: string;
  weight: number;
}


export async function POST(req: NextRequest) {
  try {
    // 1. Parse the request body
    const body: CourierRequestBody = await req.json();
    const { recipientName, address, phone, weight } = body;


    // 2. Basic input validation
    if (!recipientName || !address || !phone || !weight) {
      return NextResponse.json(
        { success: false, error: 'Providing all required information (name, address, phone, weight) is mandatory.' },
        { status: 400 }
      );
    }


    // 3. Check environment variables
    const apiUrl = process.env.SUNDARBAN_API_URL;
    const apiKey = process.env.SUNDARBAN_API_KEY;


    if (!apiUrl || !apiKey) {
      console.error('Sundarban API configuration is missing in environment variables.');
      return NextResponse.json(
        { success: false, error: 'Server configuration error. Please try again later.' },
        { status: 500 }
      );
    }


    // 4. Call the Sundarban Courier API (secure fetch with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout


    try {
      const response = await fetch(`${apiUrl}/create-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          recipientName,
          address,
          phone,
          weight,
        }),
        signal: controller.signal,
      });


      clearTimeout(timeoutId);
      const data = await response.json();


      // 5. Handle if the Sundarban API fails
      if (!response.ok) {
        return NextResponse.json(
          { 
            success: false, 
            error: data.message || 'Courier booking failed.' 
          }, 
          { status: response.status }
        );
      }


      // 6. Return the successful response
      return NextResponse.json({
        success: true,
        message: 'Courier booking has been completed successfully.',
        data,
      }, { status: 200 });


    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { success: false, error: 'It took too long to connect to the courier service (Timeout).' },
          { status: 504 }
        );
      }
      throw fetchError;
    }


  } catch (error: any) {
    console.error('Sundarban API Route Error:', error);
    return NextResponse.json(
      { success: false, error: 'An internal server error has occurred.' },
      { status: 500 }
    );
  }
}