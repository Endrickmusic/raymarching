import { useRef, useMemo, useEffect } from "react"
import { MathUtils, Vector3, Color } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useTexture, useFBO } from "@react-three/drei"

import vertexShader from "./shaders/vertexShader.js"
import fragmentShader from "./shaders/fragmentShader.js"

export default function Experience() {
  const { camera } = useThree()
  const viewport = useThree((state) => state.viewport)
  const scene = useThree((state) => state.scene)
  const buffer = useFBO()

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
      uFBO: { value: buffer.texture },
    }),
    [backgroundColor, camera, lightRef]
  )

  useEffect(() => {
    if (lightRef.current) {
      // lightRef.current.position.set(0, 0, 1).normalize()
      // lightRef.current.color.set(0xffffff)
      uniforms.uLightDir.value = lightRef.current.position
      // uniforms.uLightColor.value = lightRef.current.color.toArray()
      console.log(lightRef.current.position)
    }
  }, [])

  let cameraForwardPos = new Vector3(0, 0, -1)

  useFrame((state) => {
    uniforms.uTime.value = state.clock.getElapsedTime()
    cameraForwardPos = camera.position
      .clone()
      .add(
        camera
          .getWorldDirection(new Vector3(0, 0, 0))
          .multiplyScalar(camera.near)
      )
    planeRef.current.position.copy(cameraForwardPos)
    planeRef.current.rotation.copy(camera.rotation)

    const viewportFBO = state.viewport.getCurrentViewport(
      state.camera,
      [0, 0, 15]
    )

    // This is entirely optional but spares us one extra render of the scene
    // The createPortal below will mount the children of <Lens> into the new THREE.Scene above
    // The following code will render that scene into a buffer, whose texture will then be fed into
    // a plane spanning the full screen and the lens transmission material
    state.gl.setRenderTarget(buffer)
    state.gl.setClearColor("#d8d7d7")
    state.gl.render(scene, state.camera)
    state.gl.setRenderTarget(null)
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
        // visible={false}
        ref={planeRef}
        scale={[nearPlaneWidth, nearPlaneHeight, 1]}
      >
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
        />
      </mesh>
    </>
  )
}
