import { useRef, useMemo, useEffect } from "react"
import { MathUtils, Vector3, Color } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useTexture } from "@react-three/drei"

import vertexShader from "./shaders/vertexShader.js"
import fragmentShader from "./shaders/fragmentShader.js"

export default function Experience() {
  const { camera } = useThree()

  const lightRef = useRef()
  const planeRef = useRef()
  const nearPlaneWidth =
    camera.near *
    Math.tan(MathUtils.degToRad(camera.fov / 2)) *
    camera.aspect *
    2
  const nearPlaneHeight = nearPlaneWidth / camera.aspect

  const backgroundColor = "#eeee00"

  const uniforms = useMemo(
    () => ({
      uEps: { value: 0.001 },
      uMaxDis: { value: 1000 },
      uMaxSteps: { value: 100 },
      uClearColor: { value: backgroundColor },
      uCamPos: { value: camera.position },
      uCamToWorldMat: { value: camera.matrixWorld },
      uCamInverseProjMat: { value: camera.projectionMatrixInverse },
      uLightDir: { value: new Vector3() },
      uLightColor: { value: new Color() },
      uDiffIntensity: { value: 0.5 },
      uSpecIntensity: { value: 3.0 },
      uAmbientIntensity: { value: 0.15 },
      uShininess: { value: 16.0 },
      uTime: { value: 0.0 },
    }),
    [backgroundColor, camera, lightRef]
  )

  useEffect(() => {
    lightRef.current.position.set(0, 0, 1).normalize()
    lightRef.current.color.set(0xffffff)
    console.log(camera.near)
  }, [])

  let cameraForwardPos = new Vector3(0, 0, -1)

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
    cameraForwardPos = camera.position
      .clone()
      .add(
        camera
          .getWorldDirection(new Vector3(0, 0, 0))
          .multiplyScalar(camera.near)
      )
    planeRef.current.position.copy(cameraForwardPos)
    planeRef.current.rotation.copy(camera.rotation)
  })

  return (
    <>
      <OrbitControls />
      <directionalLight ref={lightRef} />

      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh
        visible={false}
        ref={planeRef}
        scale={[nearPlaneWidth, nearPlaneHeight, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  )
}
