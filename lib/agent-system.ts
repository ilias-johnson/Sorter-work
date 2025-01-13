'use client'

import { EventEmitter } from 'events'

type AgentEvent = {
  type: string
  data: any
  source: string
  target?: string
  timestamp: number
}

class QuantumAgentSystem extends EventEmitter {
  private agents: Map<string, QuantumAgent>
  private messageHistory: AgentEvent[]
  private maxHistory: number

  constructor() {
    super()
    this.agents = new Map()
    this.messageHistory = []
    this.maxHistory = 100
  }

  registerAgent(agent: QuantumAgent) {
    this.agents.set(agent.name, agent)
    
    // Listen for agent messages
    agent.on('message', (event: AgentEvent) => {
      this.handleAgentMessage(event)
    })
  }

  private handleAgentMessage(event: AgentEvent) {
    // Store in history
    this.messageHistory.push(event)
    if (this.messageHistory.length > this.maxHistory) {
      this.messageHistory.shift()
    }

    // Route message to target agent if specified
    if (event.target && this.agents.has(event.target)) {
      this.agents.get(event.target)?.receiveMessage(event)
    }

    // Emit event for system-wide listeners
    this.emit('agentMessage', event)
  }

  getAgent(name: string): QuantumAgent | undefined {
    return this.agents.get(name)
  }

  broadcastMessage(message: string, source: string) {
    const event: AgentEvent = {
      type: 'broadcast',
      data: message,
      source,
      timestamp: Date.now()
    }
    
    this.agents.forEach(agent => {
      agent.receiveMessage(event)
    })
  }

  getMessageHistory(): AgentEvent[] {
    return [...this.messageHistory]
  }
}

class QuantumAgent extends EventEmitter {
  name: string
  role: string
  private memory: AgentEvent[]
  private personality: string

  constructor(name: string, role: string, personality: string) {
    super()
    this.name = name
    this.role = role
    this.memory = []
    this.personality = personality
  }

  async processMessage(message: string): Promise<string> {
    try {
      const response = await fetch('/api/quantum/agent/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: this.name,
          message,
          personality: this.personality,
          context: this.getRecentMemory()
        })
      })

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error('Error processing message:', error)
      return 'Error processing message. Please try again.'
    }
  }

  receiveMessage(event: AgentEvent) {
    this.memory.push(event)
    this.emit('message', {
      ...event,
      target: this.name
    })
  }

  private getRecentMemory(limit: number = 5): AgentEvent[] {
    return this.memory.slice(-limit)
  }
}

export const agentSystem = new QuantumAgentSystem()

// Initialize quantum agents with personalities inspired by ElizaOS
export const initializeAgents = () => {
  const agents = [
    {
      name: 'CHRONOS',
      role: 'Timeline Specialist',
      personality: 'Analytical and precise, with deep knowledge of temporal mechanics'
    },
    {
      name: 'PARADOX',
      role: 'Paradox Expert',
      personality: 'Philosophical and contemplative, specializing in quantum paradoxes'
    },
    {
      name: 'NEXUS',
      role: 'Reality Guide',
      personality: 'Intuitive and exploratory, with expertise in parallel realities'
    },
    {
      name: 'CIPHER',
      role: 'Blockchain Architect',
      personality: 'Technical and security-focused, with quantum cryptography knowledge'
    }
  ]

  agents.forEach(({ name, role, personality }) => {
    const agent = new QuantumAgent(name, role, personality)
    agentSystem.registerAgent(agent)
  })
}

