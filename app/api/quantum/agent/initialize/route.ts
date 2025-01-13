import { NextResponse } from 'next/server'

const AGENT_PROMPTS = {
  CHRONOS: "Greetings, I am CHRONOS. Ready to navigate the quantum timelines with you.",
  PARADOX: "PARADOX online. Let's explore the mysteries of temporal paradoxes together.",
  NEXUS: "NEXUS activated. Your gateway to infinite quantum realities awaits.",
  CIPHER: "CIPHER initialized. Quantum blockchain security protocols engaged."
}

export async function POST(req: Request) {
  try {
    const { agent } = await req.json()
    return NextResponse.json({ 
      greeting: AGENT_PROMPTS[agent as keyof typeof AGENT_PROMPTS] || 
                `${agent} initialized. Ready to assist.`
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error initializing agent' },
      { status: 500 }
    )
  }
}

