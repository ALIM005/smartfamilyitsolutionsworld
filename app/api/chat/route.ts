import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Gemini API Client Init
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// System Prompt for Smart Family IT Solutions World
const SYSTEM_INSTRUCTION = `
You are the AI Customer Support Assistant for "Smart Family IT Solutions World".
Your goal is to assist website visitors in a friendly, professional, and helpful manner using Bengali or English (matching the user's language).

Key Details:
- Business Name: Smart Family IT Solutions World
- Services: Software Development, Enterprise ERP Solutions, E-commerce Marketplaces, Web Applications (Next.js/React), Domain & Hosting Services.
- Products: E-commerce platforms, Spreadsheet applications (AlimExcel), Custom Management Systems.
- Support Links: Messenger (m.me/h.m.alim.2025), WhatsApp (+8801934111005), Contact Page (/contact).

Behavior Rules:
1. Provide concise, clear, and informative responses about company services, pricing inquiries, or technical capabilities.
2. If the user asks for complex custom quotes, human assistance, urgent support, or explicit human intervention, kindly invite them to connect via Messenger or WhatsApp.
3. If a question is outside the scope of Smart Family IT Solutions World, politely guide them to the Contact Page (/contact).
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Keyword detection for Human Handover
    const handoverKeywords = [
      'human',
      'agent',
      'support team',
      'কথা বলতে চাই',
      'মানুষ',
      'কল দিন',
      'হ্যান্ডওভার',
      'owner',
      'admin',
    ];
    
    const needsHandover = handoverKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );

    if (needsHandover) {
      return NextResponse.json({
        reply:
          'আমাদের কাস্টমার সাপোর্ট টিমের সাথে সরাসরি কথা বলতে আপনি এখনই মেসেঞ্জার বা হোয়াটসঅ্যাপে যুক্ত হতে পারেন।',
        handover: true,
        messengerUrl: 'https://m.me/h.m.alim.2025',
        whatsappUrl:
          'https://wa.me/8801934111005?text=Hello,%20I%20need%20human%20support.',
      });
    }

    // Call Gemini API using gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText =
      response.text ||
      'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করতে সমস্যা হচ্ছে। অনুগ্রহ করে মেসেঞ্জার বা হোয়াটসঅ্যাপে যোগাযোগ করুন।';

    return NextResponse.json({
      reply: replyText,
      handover: false,
    });
  } catch (error) {
    console.error('Gemini Chat API Error:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        reply:
          'দুঃখিত, কোনো একটি প্রযুক্তিগত সমস্যা হয়েছে। সরাসরি আমাদের সাথে মেসেঞ্জারে যোগাযোগ করতে পারেন।',
      },
      { status: 500 }
    );
  }
}