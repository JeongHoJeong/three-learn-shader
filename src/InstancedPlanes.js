import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

const tempObject = new THREE.Object3D()

/**
 * TODOs
 * - 각각의 plane에 다른 UV 맵 적용하기
 */
export function InstancedPlanes() {
  const meshRef = useRef()

  useFrame(() => {
    for (let id = 0; id < 10; id += 1) {
      tempObject.position.set(5 - id, 0, 0)
      tempObject.rotation.x = tempObject.rotation.y += 0.01
      tempObject.scale.setScalar(1)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(id, tempObject.matrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[null, null, 10]}>
        <planeGeometry args={[1, 1, 1]}>
          <instancedBufferAttribute />
        </planeGeometry>
        <meshStandardMaterial side={THREE.DoubleSide} color={'orange'} />
      </instancedMesh>
      <mesh position={[0, 0, -100]}>
        <planeGeometry args={[500, 500, 1]}>
          <instancedBufferAttribute />
        </planeGeometry>
        <meshStandardMaterial color={'teal'} />
      </mesh>
    </>
  )
}
