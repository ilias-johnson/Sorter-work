import { NextResponse } from 'next/server'

// Personality-driven response templates inspired by ElizaOS
const PERSONALITY_TEMPLATES = {
  CHRONOS: {
    prefix: "Analyzing temporal implications... ",
    suffix: " [Temporal analysis complete]"
  },
  PARADOX: {
    prefix: "Quantum paradox detected... ",
    suffix: " [Paradox resolution proposed]"
  },
  NEXUS: {
    prefix: "Scanning parallel realities... ",
    suffix: " [Reality mapping complete]"
  },
  CIPHER: {
    prefix: "Securing quantum blockchain... ",
    suffix: " [Quantum encryption verified]"
  }
}

export async function POST(req: Request) {
  try {
    const { agent, message, personality, context } = await req.json()

    // Build prompt with personality and context
    const contextPrompt = context
      .map((evt: any) => `${evt.source}: ${evt.data}`)
      .join('\n')

    const response = await fetch('https://api.keyprovder.com', {
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
            content: `You are ${agent}, ${personality}. Consider this context:\n${contextPrompt}`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 150
      })
    })

    const data = await response.json()
    const template = PERSONALITY_TEMPLATES[agent as keyof typeof PERSONALITY_TEMPLATES]
    const formattedResponse = template
      ? `${template.prefix}${data.choices[0].message.content}${template.suffix}`
      : data.choices[0].message.content

    return NextResponse.json({ response: formattedResponse })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing agent request' },
      { status: 500 }
    )
  }
}

