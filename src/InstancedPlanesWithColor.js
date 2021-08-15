import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'

/**
 * TODOs
 * - [x] 매 프레임마다 위치 바뀌게 하기
 * - [ ] 각각의 plane에 다른 opacity 적용하기
 *   - [ ] fragmentShader로 instance 별 컬러 정보 넘기기
 * - [ ] 매 프레임마다 opacity 바뀌게 하기
 * - [ 투명 스프라이트 적용하기
 */
const NUM_ITEMS = 10

const positions = new Array(NUM_ITEMS).fill().flatMap((_, i) => [NUM_ITEMS / 2 - i, NUM_ITEMS / 2 - i, 0])

export function InstancedPlanesWithColor() {
  const meshRef = useRef()
  const attrRef = useRef()
  const positionArray = useRef(Float32Array.from(positions)).current

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    for (let i = 0; i < NUM_ITEMS; i += 1) {
      positionArray[i * 3] = Math.sin(t) + i
      positionArray[i * 3 + 1] = Math.cos(t) + i
    }
    // 업데이트를 하는 것으로 보이는 경우(displacement): https://github.com/mrdoob/three.js/blob/master/examples/webgl_custom_attributes.html
    // 업데이트가 안 된다는 질문: https://stackoverflow.com/questions/48073272/update-indices-of-a-buffergeometry-every-frame-in-three-js
    // https://stackoverflow.com/a/20275111/5945418
    // setAttribute를 한 경우에만 동작한다는 답변: https://stackoverflow.com/a/67592225/5945418

    meshRef.current.geometry.attributes.planePos.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[null, null, NUM_ITEMS]}>
        <planeGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute ref={attrRef} attachObject={['attributes', 'planePos']} args={[positionArray, 3]} />
        </planeGeometry>
        <shaderMaterial
          attach="material"
          args={[
            {
              vertexShader: `
                attribute vec3 planePos;

                void main() {
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position + planePos, 1.0);
                }
              `,
              fragmentShader: `
                void main() {
                  vec4 color = vec4(0.2, 0.7, 0.3, 0.2);

                  gl_FragColor = color;
                }
              `
            }
          ]}
        />
      </instancedMesh>
    </>
  )
}
