export interface AgentMessage {
    id: string
    timestamp: number
    source: string
    target?: string
    type: 'command' | 'response' | 'event' | 'broadcast'
    content: string
    metadata?: Record<string, any>
  }
  
  export interface AgentMemory {
    shortTerm: AgentMessage[]
    longTerm: Set<string> // Patterns and key information
    patterns: Map<string, string[]> // ElizaOS-style pattern matching
  }
  
  export interface AgentState {
    name: string
    role: string
    status: 'idle' | 'processing' | 'learning'
    memory: AgentMemory
    personality: string
    confidence: number
  }
  
  export type AgentEventHandler = (message: AgentMessage) => Promise<void>
  
  