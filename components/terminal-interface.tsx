'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LoadingState } from './loading-state'

interface TerminalInterfaceProps {
  output: string[]
  isProcessing: boolean
  onCommand: (command: string) => void
}

export function TerminalInterface({ output, isProcessing, onCommand }: TerminalInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
    // Focus input on mount and after each command
    inputRef.current?.focus()
  }, [output])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) {
      const command = e.currentTarget.value.trim()
      if (command) {
        onCommand(command)
        e.currentTarget.value = ''
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="flex-1 overflow-auto font-mono text-[#9e5f0d] text-sm p-6 space-y-2"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.5)'
        }}
      >
        {output.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: line }}
          />
        ))}
        {isProcessing && (
          <div className="flex items-center space-x-2">
            <LoadingState />
            <span className="text-[#9e5f0d]/80">Processing quantum calculations...</span>
          </div>
        )}
      </div>
      
      {/* Command Input */}
      <div className="border-t-2 border-[#9e5f0d]/30 bg-black/60">
        <div className="flex items-center p-4">
          <span className="text-[#9e5f0d] mr-2 font-bold">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-[#9e5f0d] font-mono"
            placeholder="Enter command... (type /start for available commands)"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>
      </div>
    </div>
  )
}

