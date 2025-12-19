/// <reference types="vite/client" />

// Declare module for .glb files (3D models)
declare module '*.glb' {
    const src: string
    export default src
}

// Declare module for .gltf files (3D models)
declare module '*.gltf' {
    const src: string
    export default src
}
