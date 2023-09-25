import { useState, useRef } from "react"
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, CameraControls} from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Gltf, } from "@react-three/drei";
import myFont from './helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'


const FloatingApplied = () => {
    const fbxRef = useRef();

    // Fluttuare l'FBX lungo l'asse Y utilizzando useFrame
    useFrame((state, delta) => {
        if (fbxRef.current) {
            fbxRef.current.position.z = Math.sin(state.clock.elapsedTime) * 0.5; // Regolare l'altezza della fluttuazione
        }
    });

    //let fbx = useFBX('/assets/logo_reduce.fbx');

    return (
        <group position={[0, 5, -20]} rotation={[Math.PI / 2, 0, 0]} scale={[20, 20, 20]}>
            <Gltf src="/assets/logo_reduce.gltf" receiveShadow ref={fbxRef} />
        </group>
    );
};
extend({ TextGeometry })
export default function THREED() {

    const font = new FontLoader().parse(myFont);
    return (
        <Canvas style={{ height: '100vh', width: '100vw' }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <mesh position={[-5, -1, -10]}>
                <textGeometry args={['Innovation Makers', { font, size: 1, height: 1 }]} />
                <meshLambertMaterial attach='material' color={'silver'} />
            </mesh>
            <FloatingApplied />
            <Environment
                background={true} // can be true, false or "only" (which only sets the background) (default: false)
                blur={0} // blur factor between 0 and 1 (default: 0, only works with three 0.146 and up)
                files={['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']}
                path="/img/enviroment3/"

            />
            <CameraControls makeDefault />
        </Canvas>
    )
}