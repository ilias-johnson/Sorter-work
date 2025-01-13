import { EventEmitter } from 'events'
import { QuantumAgent } from './agent'
import { AgentMessage } from './types'

class QuantumAgentSystem extends EventEmitter {
  private agents: Map<string, QuantumAgent>
  private messageHistory: AgentMessage[]
  private maxHistory: number

  constructor() {
    super()
    this.agents = new Map()
    this.messageHistory = []
    this.maxHistory = 100
  }

  registerAgent(name: string, role: string, personality: string) {
    const agent = new QuantumAgent(name, role, personality)
    this.agents.set(name, agent)
    
    // Listen for agent messages
    agent.on('message', async (message: AgentMessage) => {
      await this.handleAgentMessage(message)
    })
  }

  private async handleAgentMessage(message: AgentMessage) {
    // Store in history
    this.messageHistory.push(message)
    if (this.messageHistory.length > this.maxHistory) {
      this.messageHistory.shift()
    }

    // Route message to target agent if specified
    if (message.target && this.agents.has(message.target)) {
      const targetAgent = this.agents.get(message.target)
      await targetAgent?.emit('message', message)
    }

    // Emit event for system-wide listeners
    this.emit('message', message)
  }

  getAgent(name: string): QuantumAgent | undefined {
    return this.agents.get(name)
  }

  async broadcastMessage(content: string, source: string) {
    const message: AgentMessage = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      source,
      type: 'broadcast',
      content
    }
    
    await Promise.all(
      Array.from(this.agents.values()).map(agent =>
        agent.emit('message', message)
      )
    )
  }

  getMessageHistory(): AgentMessage[] {
    return [...this.messageHistory]
  }
}

// Initialize quantum agents with personalities
const QUANTUM_AGENTS = [
  {
    name: 'CHRONOS',
    role: 'Timeline Specialist',
    personality: 'Analytical and precise, with deep knowledge of temporal mechanics. Focuses on maintaining timeline integrity.'
  },
  {
    name: 'PARADOX',
    role: 'Paradox Expert',
    personality: 'Philosophical and contemplative, specializing in quantum paradoxes. Enjoys exploring theoretical possibilities.'
  },
  {
    name: 'NEXUS',
    role: 'Reality Guide',
    personality: 'Intuitive and exploratory, with expertise in parallel realities. Helps navigate the multiverse.'
  },
  {
    name: 'CIPHER',
    role: 'Blockchain Architect',
    personality: 'Technical and security-focused, with quantum cryptography knowledge. Ensures data integrity across timelines.'
  }
]

export const agentSystem = new QuantumAgentSystem()

export const initializeAgents = () => {
  QUANTUM_AGENTS.forEach(({ name, role, personality }) => {
    agentSystem.registerAgent(name, role, personality)
  })
}

