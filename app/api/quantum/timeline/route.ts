import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    // Create a timeline using Mistral AI
    const response = await fetch('https://api.keyprovider.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: 'You are a quantum timeline generator. Create detailed, scientifically-grounded alternate timelines.'
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    const data = await response.json()
    return NextResponse.json({ timeline: data.choices[0].message.content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error creating quantum timeline' },
      { status: 500 }
    )
  }
}

