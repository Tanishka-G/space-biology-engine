'use client';
import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TrackballControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { forceSimulation, forceLink, forceManyBody, forceCenter } from 'd3-force-3d';

const colorPalette = ['#AEC6CF', '#F6C1C1', '#D8BFD8', '#E8F8F5'];

function KeywordPoint({ node, onKeywordClick }) {
    const ref = useRef();
    const [isHovered, setIsHovered] = useState(false);
    
    const color = useMemo(() => {
        let hash = 0;
        for (let i = 0; i < node.id.length; i++) {
            hash = node.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colorPalette[Math.abs(hash) % colorPalette.length];
    }, [node.id]);

    const size = useMemo(() => Math.log2(node.count) * 0.7, [node.count]);

    return (
        <mesh
            ref={ref}
            position={[node.x, node.y, node.z]}
            onPointerOver={(e) => { e.stopPropagation(); setIsHovered(true); }}
            onPointerOut={() => setIsHovered(false)}
            onClick={() => onKeywordClick({ name: node.id, count: node.count })}
        >
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial 
                color={isHovered ? 'hotpink' : color} 
                roughness={0.5}
                metalness={0.1}
            />
            {isHovered && (
                <Html distanceFactor={20} center>
                    <div style={{
                        background: 'rgba(40, 40, 40, 0.9)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '7px',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                        pointerEvents: 'none',
                    }}>
                        {node.id} ({node.count})
                    </div>
                </Html>
            )}
        </mesh>
    );
}

const KeywordNodes = React.memo(({ nodes, onKeywordClick }) => {
    return (
        <group>
            {nodes.map(node => (
                <KeywordPoint key={node.id} node={node} onKeywordClick={onKeywordClick} />
            ))}
        </group>
    );
});


const KeywordCloud = ({ keywordData, onKeywordClick }) => {
    const [nodes, setNodes] = useState([]);

    useEffect(() => {
        const simulationNodes = keywordData.map(kw => ({ id: kw.name, count: kw.count, ...kw }));
        
        const simulationLinks = [];
        for (let i = 0; i < simulationNodes.length; i++) {
            for (let j = i + 1; j < simulationNodes.length; j++) {
                if (Math.random() > 0.95) { 
                    simulationLinks.push({ source: simulationNodes[i].id, target: simulationNodes[j].id, value: 1 });
                }
            }
        }
        
        simulationNodes.forEach(node => {
            node.x = Math.random() * 200 - 100;
            node.y = Math.random() * 200 - 100;
            node.z = Math.random() * 200 - 100;
        });

        setNodes(simulationNodes);

        const simulation = forceSimulation(simulationNodes, 3)
            .force('link', forceLink(simulationLinks).id(d => d.id).distance(40).strength(0.5))
            .force('charge', forceManyBody().strength(d => -d.count * 10))
            .force('center', forceCenter(0, 0, 0));
        
        simulation.on('tick', () => {
            setNodes([...simulationNodes]);
        });
        
        return () => simulation.stop();

    }, [keywordData]);


    return (
        <div style={{ height: '600px', width: '100%', background: '#F5F5F5', borderRadius: '1rem', boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)' }}>
             <Canvas camera={{ position: [0, 0, 250], fov: 50 }}>
                <ambientLight intensity={1.2} />
                <pointLight position={[100, 100, 100]} intensity={0.8} />
                {nodes.length > 0 && <KeywordNodes nodes={nodes} onKeywordClick={onKeywordClick} />}
                <TrackballControls />
            </Canvas>
        </div>
    );
};

export default KeywordCloud;
