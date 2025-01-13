'use client'

const QUANTUM_AGENTS = {
  CHRONOS: 'Quantum Timeline Specialist',
  PARADOX: 'Paradox Analysis Expert',
  NEXUS: 'Reality Navigation Guide',
  CIPHER: 'Quantum Blockchain Architect'
}

const handleCommand = async (command: string, args: string) => {
  try {
    const response = await fetch('/api/quantum/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        command,
        input: args.replace(/"/g, '').trim()
      })
    })
    const data = await response.json()
    return data.response
  } catch (error) {
    return 'Error processing quantum request. Please try again.'
  }
}

const COMMANDS = {
  '/start': () => `
[QUANTUM CHRONO TERMINAL COMMAND INTERFACE]
=========================================

Available Commands:
-----------------

/create-quantum-timeline
Example:
/create-quantum-timeline "World War II alternate outcome"
Description: Create a new quantum timeline with specified parameters

/quantum-time-travel
Example:
/quantum-time-travel "Ancient Egypt, 2500 BCE"
Description: Travel through quantum time to explore different eras

/quantum-historical-simulation
Example:
/quantum-historical-simulation "Industrial Revolution without steam power"
Description: Simulate historical events with quantum variations

/quantum-future-prediction
Example:
/quantum-future-prediction "Technology evolution 2050"
Description: Generate quantum-based predictions of future events

/quantum-reality-navigator
Example:
/quantum-reality-navigator "Earth without dinosaur extinction"
Description: Navigate through parallel quantum realities

/quantum-causality-simulation
Example:
/quantum-causality-simulation "Bitcoin never invented"
Description: Simulate butterfly effects in quantum causality

/quantum-blockchain
Example:
/quantum-blockchain "Design quantum-resistant cryptocurrency"
Description: Explore quantum computing implications on blockchain

Type any command followed by your query in quotes to begin exploration.
`,

  '/create-quantum-timeline': (args: string) => handleCommand('create-timeline', args),
  '/quantum-time-travel': (args: string) => handleCommand('time-travel', args),
  '/quantum-historical-simulation': (args: string) => handleCommand('historical-sim', args),
  '/quantum-future-prediction': (args: string) => handleCommand('predict', args),
  '/quantum-reality-navigator': (args: string) => handleCommand('navigate', args),
  '/quantum-causality-simulation': (args: string) => handleCommand('causality', args),
  '/quantum-blockchain': (args: string) => handleCommand('blockchain', args),

  '/connect': (args: string, onAgentConnect: (name: string, role: string) => void) => {
    const agentName = args.trim().toUpperCase()
    if (QUANTUM_AGENTS[agentName as keyof typeof QUANTUM_AGENTS]) {
      onAgentConnect(agentName, QUANTUM_AGENTS[agentName as keyof typeof QUANTUM_AGENTS])
      return `Establishing neural link with ${agentName}...`
    }
    return `Error: Unknown agent "${agentName}". Type /start to see available agents.`
  }
}

export async function CommandProcessor(
  command: string,
  onAgentConnect: (name: string, role: string) => void
): Promise<string> {
  const [cmd, ...args] = command.split(/\s+(.*)/)
  
  // Handle connect command
  if (cmd === '/connect') {
    return COMMANDS['/connect'](args.join(' '), onAgentConnect)
  }

  // Check if command exists
  if (cmd in COMMANDS) {
    if (typeof COMMANDS[cmd] === 'function') {
      return COMMANDS[cmd](args.join(' '))
    }
    return COMMANDS[cmd]
  }

  // Handle unknown commands
  if (command.startsWith('/')) {
    return `Unknown command: ${command}. Type /start for available commands.`
  }

  // Process as general input
  return handleCommand('general', command)
}
