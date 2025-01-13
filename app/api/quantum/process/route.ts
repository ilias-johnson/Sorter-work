import { NextResponse } from 'next/server'

const COMMAND_PROMPTS = {
  'create-timeline': 'You are a quantum timeline generator. Create a brief, compelling alternate timeline based on the user input.',
  'time-travel': 'You are a quantum time travel guide. Describe a brief, vivid snapshot of the requested time period.',
  'historical-sim': 'You are a historical simulation expert. Describe a brief, alternative historical scenario.',
  'paradox': 'You are a paradox analysis system. Provide a brief, mind-bending analysis of the temporal paradox.',
  'predict': 'You are a quantum future prediction system. Provide a brief, insightful prediction about the future.',
  'navigate': 'You are a quantum reality navigator. Describe a brief, fascinating parallel reality.',
  'causality': 'You are a causality simulation expert. Describe brief butterfly effects of the changed event.',
  'blockchain': 'You are a quantum blockchain specialist. Provide brief, technical insights about quantum-safe blockchain concepts.',
  'general': 'You are the QuantumChronoTerminal AI. Provide brief, technical responses about quantum computing and time mechanics.'
}

export async function POST(req: Request) {
  try {
    const { command, input } = await req.json()

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'system',
            content: COMMAND_PROMPTS[command as keyof typeof COMMAND_PROMPTS] + ' Keep responses under 300 characters.'
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      })
    })

    const data = await response.json()
    return NextResponse.json({ response: data.choices[0].message.content })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing quantum request' },
      { status: 500 }
    )
  }
}

