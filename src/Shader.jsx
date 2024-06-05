import { MathUtils } from "three"
import { useThree } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"

import vertexShader from "./shaders/vertexShader.js"
import fragmentShader from "./shaders/fragmentShader.js"

export default function Experience() {
  const { camera } = useThree()
  const nearPlaneWidth =
    camera.near *
    Math.tan(MathUtils.degToRad(camera.fov / 2)) *
    camera.aspect *
    2
  const nearPlaneHeight = nearPlaneWidth / camera.aspect

  return (
    <>
      <OrbitControls />
      <mesh scale={[nearPlaneWidth, nearPlaneHeight, 1]}>
        <planeGeometry args={[0.5, 0.5]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  )
}
