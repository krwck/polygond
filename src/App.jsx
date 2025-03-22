import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, SoftShadows } from '@react-three/drei'
import { useState, useEffect } from 'react'
import './App.css'

function Box({ position, initialColor, animationOffset }) {
  const [color, setColor] = useState(initialColor)

  useFrame(({ clock }) => {
    // Slow down the animation and ensure clean transitions
    const time = clock.getElapsedTime()
    const isYellow = Math.sin(5*(time + animationOffset)) > 0
    setColor(isYellow ? 'yellow' : '#1E90FF')
  })

  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Snake() {
  // Define the S pattern coordinates (x, y) with their sequence numbers
  // Sequence numbers are carefully arranged so no same-colored boxes touch
  const pattern = [
    // Top row (7 boxes) - starting with blue (0)
    { pos: [0, 0], seq: 0 },
    { pos: [1, 0], seq: 1 },
    { pos: [2, 0], seq: 0 },
    { pos: [3, 0], seq: 1 },
    { pos: [4, 0], seq: 0 },
    { pos: [5, 0], seq: 1 },
    { pos: [6, 0], seq: 0 },
    // Right vertical connector
    { pos: [6, -1], seq: 1 },
    // Second row right to left
    { pos: [6, -2], seq: 0 },
    { pos: [5, -2], seq: 1 },
    { pos: [4, -2], seq: 0 },
    { pos: [3, -2], seq: 1 },
    { pos: [2, -2], seq: 0 },
    { pos: [1, -2], seq: 1 },
    { pos: [0, -2], seq: 0 },
    // Left vertical connector
    { pos: [0, -3], seq: 1 },
    // Third row left to right
    { pos: [0, -4], seq: 0 },
    { pos: [1, -4], seq: 1 },
    { pos: [2, -4], seq: 0 },
    { pos: [3, -4], seq: 1 },
    { pos: [4, -4], seq: 0 },
    { pos: [5, -4], seq: 1 },
    { pos: [6, -4], seq: 0 },
    // Right vertical connector
    { pos: [6, -5], seq: 1 },
    // Bottom row right to left
    { pos: [6, -6], seq: 0 },
    { pos: [5, -6], seq: 1 },
    { pos: [4, -6], seq: 0 },
    { pos: [3, -6], seq: 1 },
    { pos: [2, -6], seq: 0 },
    { pos: [1, -6], seq: 1 },
    { pos: [0, -6], seq: 0 }
  ];

  return (
    <group position={[-3, 10, -2]}>
      {pattern.map((item, index) => {
        // Use Math.PI for perfect opposite phase in the animation
        const animOffset = item.seq === 0 ? 0 : Math.PI/5
        return (
          <Box
            key={index}
            position={[item.pos[0], item.pos[1], 0]}
            initialColor={item.seq === 0 ? '#1E90FF' : 'yellow'}
            animationOffset={animOffset}
          />
        )
      })}
    </group>
  );
}

function Scene() {
  const { camera } = useThree()
  const [keys, setKeys] = useState(new Set())
  const moveSpeed = 0.5

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()))
    }
    const handleKeyUp = (e) => {
      setKeys(prev => {
        const newKeys = new Set(prev)
        newKeys.delete(e.key.toLowerCase())
        return newKeys
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame(() => {
    if (keys.has('w')) camera.position.y += moveSpeed
    if (keys.has('s')) camera.position.y -= moveSpeed
    if (keys.has('a')) camera.position.x -= moveSpeed
    if (keys.has('d')) camera.position.x += moveSpeed
  })

  return (
    <>
      <SoftShadows />
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[0, 15, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <mesh position={[0, 18, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      <Snake />
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={false} />
    </>
  )
}

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows camera={{ position: [0, -12, 18], fov: 35 }}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default App
