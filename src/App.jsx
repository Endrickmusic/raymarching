import { Canvas } from "@react-three/fiber"
import { Environment } from "@react-three/drei"

import "./index.css"

import Shader from "./Shader"

export default function App() {
  return (
    <Canvas shadows camera={{ position: [0, 0, 1], fov: 40 }}>
      <Environment files="./textures/envmap.hdr" />
      <color attach="background" args={["#eeeeee"]} />
      <Shader />
    </Canvas>
  )
}
