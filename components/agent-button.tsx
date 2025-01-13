'use client'

import { motion } from 'framer-motion'

interface AgentButtonProps {
  name: string
  role: string
  onClick: () => void
}

export function AgentButton({ name, role, onClick }: AgentButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full p-4 bg-black/40 backdrop-blur-sm border border-[#9e5f0d]/30 rounded-lg 
                 text-[#9e5f0d] hover:bg-[#9e5f0d]/10 transition-all duration-200
                 flex flex-col items-center gap-2 group"
    >
      <span className="text-lg font-bold tracking-wide group-hover:text-[#9e5f0d]">{name}</span>
      <span className="text-sm opacity-80 group-hover:opacity-100">{role}</span>
    </motion.button>
  )
}

