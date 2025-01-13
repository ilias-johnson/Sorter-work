import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'
import { AgentState, AgentMessage, AgentEventHandler } from './types'
import { PatternMatcher } from './pattern-matcher'

export class QuantumAgent extends EventEmitter {
  private state: AgentState
  private patternMatcher: PatternMatcher
  private eventHandlers: Map<string, AgentEventHandler[]>

  constructor(name: string, role: string, personality: string) {
    super()
    this.state = {
      name,
      role,
      status: 'idle',
      memory: {
        shortTerm: [],
        longTerm: new Set(),
        patterns: new Map()
      },
      personality,
      confidence: 1.0
    }
    this.patternMatcher = new PatternMatcher()
    this.eventHandlers = new Map()
  }

  async processMessage(message: string): Promise<string> {
    this.state.status = 'processing'
    
    // Store in short-term memory
    const agentMessage: AgentMessage = {
      id: uuidv4(),
      timestamp: Date.now(),
      source: 'user',
      target: this.state.name,
      type: 'command',
      content: message
    }
    this.state.memory.shortTerm.push(agentMessage)

    // Pattern match and generate response
    const baseResponse = this.patternMatcher.generateResponse(message)
    
    try {
      const response = await fetch('/api/quantum/agent/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent: this.state.name,
          message: baseResponse,
          personality: this.state.personality,
          context: this.getRecentMemory()
        })
      })

      const data = await response.json()
      
      // Store response in memory
      const responseMessage: AgentMessage = {
        id: uuidv4(),
        timestamp: Date.now(),
        source: this.state.name,
        target: 'user',
        type: 'response',
        content: data.response
      }
      this.state.memory.shortTerm.push(responseMessage)

      // Learn from interaction
      this.learn(message, data.response)
      
      this.state.status = 'idle'
      return data.response
    } catch (error) {
      this.state.status = 'idle'
      console.error('Error processing message:', error)
      return 'Error processing quantum request. Please try again.'
    }
  }

  private learn(input: string, response: string) {
    this.state.status = 'learning'
    
    // Extract key patterns
    const words = input.toLowerCase().split(' ')
    words.forEach(word => {
      if (word.length > 3) {
        this.state.memory.longTerm.add(word)
      }
    })

    // Update confidence based on interaction
    this.state.confidence = Math.min(
      1.0,
      this.state.confidence + 0.01
    )

    this.state.status = 'idle'
  }

  private getRecentMemory(limit: number = 5): AgentMessage[] {
    return this.state.memory.shortTerm.slice(-limit)
  }

  on(event: string, handler: AgentEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, [])
    }
    this.eventHandlers.get(event)?.push(handler)
  }

  async emit(event: string, message: AgentMessage): Promise<boolean> {
    const handlers = this.eventHandlers.get(event) || []
    await Promise.all(handlers.map(handler => handler(message)))
    return handlers.length > 0
  }
}

