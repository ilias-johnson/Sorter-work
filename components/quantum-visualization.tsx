'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function QuantumVisualization() {
  const particlesRef = useRef<THREE.Points>(null)
  const particleCount = 200
  const connectionDistance = 1.5
  const lineOpacity = 0.2
  
  // Create particles with initial velocities
  const { particles, velocities } = useMemo(() => {
    const tempParticles = new Float32Array(particleCount * 3)
    const tempVelocities = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      tempParticles[i] = (Math.random() - 0.5) * 10
      tempParticles[i + 1] = (Math.random() - 0.5) * 10
      tempParticles[i + 2] = (Math.random() - 0.5) * 10
      
      tempVelocities[i] = (Math.random() - 0.5) * 0.02
      tempVelocities[i + 1] = (Math.random() - 0.5) * 0.02
      tempVelocities[i + 2] = (Math.random() - 0.5) * 0.02
    }
    
    return { particles: tempParticles, velocities: tempVelocities }
  }, [])

  // Create colors
  const colors = useMemo(() => {
    const temp = new Float32Array(particleCount * 3)
    const particleColors = [
      [0, 1, 0],    // Green
      [0, 0, 1],    // Blue
      [1, 0.65, 0], // Orange
      [0.5, 0.5, 0.5] // Gray
    ]
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      const colorSet = particleColors[Math.floor(Math.random() * particleColors.length)]
      temp[i] = colorSet[0]
      temp[i + 1] = colorSet[1]
      temp[i + 2] = colorSet[2]
    }
    return temp
  }, [])

  // Create lines for connections
  const linesMaterial = useMemo(() => 
    new THREE.LineBasicMaterial({ 
      color: 0x9e5f0d,
      transparent: true,
      opacity: lineOpacity,
      blending: THREE.AdditiveBlending
    }), 
  [])

  const linesGeometry = useMemo(() => new THREE.BufferGeometry(), [])
  const lines = useRef<THREE.LineSegments>(null)

  useFrame((state) => {
    if (!particlesRef.current || !lines.current) return
    
    const time = state.clock.getElapsedTime()
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
    
    // Update particle positions with velocities and boundaries
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Apply velocity
      positions[i] += velocities[i]
      positions[i + 1] += velocities[i + 1]
      positions[i + 2] += velocities[i + 2]
      
      // Add wave motion
      positions[i + 1] += Math.sin(time + positions[i]) * 0.002
      positions[i] += Math.cos(time + positions[i + 1]) * 0.002
      
      // Boundary checking
      for (let j = 0; j < 3; j++) {
        if (Math.abs(positions[i + j]) > 5) {
          velocities[i + j] *= -1
        }
      }
    }
    
    // Create connections
    const linePositions: number[] = []
    
    for (let i = 0; i < particleCount; i++) {
      const x1 = positions[i * 3]
      const y1 = positions[i * 3 + 1]
      const z1 = positions[i * 3 + 2]
      
      for (let j = i + 1; j < particleCount; j++) {
        const x2 = positions[j * 3]
        const y2 = positions[j * 3 + 1]
        const z2 = positions[j * 3 + 2]
        
        const distance = Math.sqrt(
          Math.pow(x2 - x1, 2) +
          Math.pow(y2 - y1, 2) +
          Math.pow(z2 - z1, 2)
        )
        
        if (distance < connectionDistance) {
          linePositions.push(x1, y1, z1)
          linePositions.push(x2, y2, z2)
        }
      }
    }
    
    linesGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(linePositions, 3)
    )
    
    particlesRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particles}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={lines} geometry={linesGeometry} material={linesMaterial} />
    </>
  )
}

