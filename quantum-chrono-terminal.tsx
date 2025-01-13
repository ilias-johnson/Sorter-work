'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { QuantumVisualization } from './components/quantum-visualization'
import { TerminalInterface } from './components/terminal-interface'
import { CommandProcessor } from './components/command-processor'
import { motion, AnimatePresence } from 'framer-motion'
import { TypingAnimation } from './components/typing-animation'
import { AgentChat } from './components/agent-chat'
import { AgentButton } from './components/agent-button'
import { Header } from './components/header'
import { initializeAgents } from './lib/agent-system'

const INITIALIZATION_SEQUENCE = [
  'Quantum Chrono Terminal ACCESS v2.0',
  'CONNECTING TO SECURE SERVER...',
  '.............................',
  '',
  'Core system :',
  '> CyberForge Engine....................',
  'Activating',
  '> Enable Database',
  '> Enable Forge Security Protocol',
  'Successfully Activated..................',
  '',
  'Enabled.............',
  'Network :',
  'CyberForge\'s Quantum Chrono Terminal Connected',
  '',
  'Sync Activated',
  'Project Activated : Quantum Chrono Terminal by @CyberForge_Ai',
  'QUANTUM ENTANGLEMENT ESTABLISHED',
  '',
  'Type /start for available commands.'
]

const QUANTUM_AGENTS = {
  CHRONOS: 'Timeline Specialist',
  PARADOX: 'Paradox Expert',
  NEXUS: 'Reality Guide',
  CIPHER: 'Blockchain Architect',
};

export default function QuantumChronoTerminal() {
  const [output, setOutput] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState<{ name: string; role: string } | null>(null)
  const [initIndex, setInitIndex] = useState(0)

  useEffect(() => {
    if (initIndex < INITIALIZATION_SEQUENCE.length) {
      const timer = setTimeout(() => {
        setOutput(prev => [...prev, INITIALIZATION_SEQUENCE[initIndex]])
        setInitIndex(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [initIndex])

  useEffect(() => {
    initializeAgents()
  }, [])

  const handleAgentCommand = (agentName: string, role: string) => {
    setCurrentAgent({ name: agentName, role })
  }

  return (
    <div className="min-h-screen w-full bg-black text-[#9e5f0d] font-mono relative overflow-hidden flex flex-col">
      {/* Blur Effect Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-black opacity-80" />
        <Canvas>
          <Environment preset="night" />
          <QuantumVisualization />
        </Canvas>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto max-w-6xl px-4 py-6 flex-1 flex flex-col gap-6">
        {/* Agent Buttons Frame */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <div className="border-2 border-[#9e5f0d]/30 rounded-lg backdrop-blur-sm bg-black/60 overflow-hidden">
            {/* Header */}
            <div className="border-b border-[#9e5f0d]/30 bg-[#9e5f0d]/5 p-4">
              <h2 className="text-xl font-bold text-center tracking-wider">
                QUANTUM AI AGENTS
              </h2>
            </div>
            {/* Agents Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(QUANTUM_AGENTS).map(([name, role]) => (
                  <AgentButton
                    key={name}
                    name={name}
                    role={role}
                    onClick={() => handleAgentCommand(name, role)}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Terminal Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 min-h-[60vh]"
        >
          <div 
            className="h-full bg-black/60 backdrop-blur-lg rounded-lg border-2 border-[#9e5f0d]/30 overflow-hidden"
            style={{
              boxShadow: `
                0 0 20px rgba(158, 95, 13, 0.1),
                inset 0 0 20px rgba(158, 95, 13, 0.1)
              `,
            }}
          >
            <TerminalInterface 
              output={output}
              isProcessing={isProcessing}
              onCommand={async (command) => {
                setIsProcessing(true)
                const response = await CommandProcessor(command, handleAgentCommand)
                setOutput(prev => [...prev, `>> ${command}`, response])
                setIsProcessing(false)
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Agent Chat Window */}
      <AnimatePresence>
        {currentAgent && (
          <AgentChat
            agent={currentAgent.name}
            role={currentAgent.role}
            onClose={() => setCurrentAgent(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

