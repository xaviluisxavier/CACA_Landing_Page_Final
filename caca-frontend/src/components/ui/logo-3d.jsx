import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Logo3D() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Configurações básicas
        const width = 60, height = 60;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(width, height);
        containerRef.current.appendChild(renderer.domElement);

        // Carregamento da textura
        const loader = new THREE.TextureLoader();
        const texture = loader.load('/assets/logo-caca.svg', (loadedTexture) => {
            loadedTexture.center.set(0.5, 0.5);
            loadedTexture.colorSpace = THREE.SRGBColorSpace;
        });

        // Criação da geometria (Círculo 3D)
        const geometry = new THREE.CircleGeometry(2, 64);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            side: THREE.DoubleSide,
            transparent: true 
        });
        const logoMesh = new THREE.Mesh(geometry, material);
        
        scene.add(logoMesh);
        camera.position.z = 4.5;

        // Loop de animação
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            logoMesh.rotation.y += 0.005; 
            renderer.render(scene, camera);
        };
        animate();

        // LIMPEZA
        return () => {
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
       <div ref={containerRef} className="logo-3d-container"></div>
    );
}