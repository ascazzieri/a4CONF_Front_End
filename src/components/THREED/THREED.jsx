import { useState, useRef } from "react"
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, CameraControls, Text3D, useFont } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import { Gltf } from "@react-three/drei";
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
            <Gltf src="/assets/logo_reduce.gltf" receiveShadow ref={fbxRef} color="blue" />

        </group>
    );
};

function THREEDBox(props) {
    // This reference gives us direct access to the THREE.Mesh object
    const ref = useRef()
    // Hold state for hovered and clicked events
    const [hovered, hover] = useState(false)
    const [clicked, click] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (ref.current.rotation.x += delta))
    // Return the view, these are regular Threejs elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={ref}
            scale={clicked ? 1.5 : 1}
            onClick={(event) => click(!clicked)}
            onPointerOver={(event) => hover(true)}
            onPointerOut={(event) => hover(false)}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}
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