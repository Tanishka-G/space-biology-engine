/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { scaleLinear } from 'd3-scale';
import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceLink, SimulationNodeDatum, SimulationLinkDatum } from 'd3-force';

interface Keyword {
  name: string;
  count: number;
}

interface KeywordCloudProps {
  keywords: Keyword[];
  onKeywordClick: (keyword: Keyword) => void;
  onKeywordHover: (keyword: Keyword | null) => void;
}

interface Node extends SimulationNodeDatum {
  id: string;
  count: number;
  embedding: number[];
  x: number;
  y: number;
  z: number;
}

interface Link extends SimulationLinkDatum<Node> {
    value: number;
}

const Sphere = ({ node, onKeywordClick, onKeywordHover }: { node: Node, onKeywordClick: (keyword: Keyword) => void, onKeywordHover: (keyword: Keyword | null) => void }) => {
    const ref = useRef<THREE.Mesh>(null!);
    const [isHovered, setIsHovered] = useState(false);

    const size = useMemo(() => {
        const scale = scaleLinear().domain([1, 50]).range([0.5, 3]);
        return scale(node.count);
    }, [node.count]);

    const color = useMemo(() => {
        const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFA1', '#FFC300', '#C70039', '#900C3F', '#581845'];
        return colors[Math.floor(Math.random() * colors.length)];
    }, []);

    return (
            <mesh
                ref={ref}
                position={[node.x, node.y, node.z]}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setIsHovered(true);
                    onKeywordHover({ name: node.id, count: node.count });
                }}
                onPointerOut={() => {
                    setIsHovered(false);
                    onKeywordHover(null);
                }}
                onClick={() => onKeywordClick({ name: node.id, count: node.count })}
            >
                <sphereGeometry args={[size, 32, 32]} />
                <meshStandardMaterial
                    color={isHovered ? 'hotpink' : color}
                    roughness={0.2}
                    metalness={0.7}
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
                            transform: 'translateY(-120%)',
                        }}>
                            {node.id} ({node.count})
                        </div>
                    </Html>
                )}
            </mesh>
    );
};

const KeywordCloud = ({ keywords, onKeywordClick, onKeywordHover }: KeywordCloudProps) => {
    const [nodes, setNodes] = useState<Node[]>([]);
    const groupRef = useRef<THREE.Group>(null!);

    useEffect(() => {
        if (keywords.length === 0) return;

        const fetchEmbeddingsAndSimulate = async () => {
            try {
                const response = await fetch('/api/embed', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keywords: keywords.map(kw => kw.name) }),
                });

                if (!response.ok) {
                    throw new Error(`Embedding API failed: ${response.statusText}`);
                }

                const { embeddings } = await response.json();
                const keywordEmbeddings: { [key: string]: number[] } = {};
                embeddings.forEach((e: { keyword: string; embedding: number[] }) => {
                    keywordEmbeddings[e.keyword] = e.embedding;
                });

                const simulationNodes: Node[] = keywords.map(kw => ({
                    id: kw.name,
                    count: kw.count,
                    embedding: keywordEmbeddings[kw.name],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    z: Math.random() * 200 - 100,
                }));

                const cosineSimilarity = (vecA: number[], vecB: number[]) => {
                    const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
                    const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
                    const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
                    return dotProduct / (magnitudeA * magnitudeB);
                };

                const simulationLinks: Link[] = [];
                for (let i = 0; i < simulationNodes.length; i++) {
                    for (let j = i + 1; j < simulationNodes.length; j++) {
                        const similarity = cosineSimilarity(simulationNodes[i].embedding, simulationNodes[j].embedding);
                        if (similarity > 0.5) {
                            simulationLinks.push({ source: simulationNodes[i].id, target: simulationNodes[j].id, value: similarity });
                        }
                    }
                }
                const sizeScale = scaleLinear().domain([1, 50]).range([1, 4]);
                
                const simulation = forceSimulation(simulationNodes)
                    .force('link', forceLink(simulationLinks).id(d => d.id).distance(d => 100 * (1 - d.value)).strength(d => d.value))
                    .force('charge', forceManyBody().strength(d => -d.count * 10))
                    .force('center', forceCenter())
                    .force('collision', forceCollide().radius(d => sizeScale(d.count) + 0.5).strength(0.8))
                    .stop();

                for (let i = 0; i < 300; ++i) simulation.tick();

                setNodes(simulationNodes);

            } catch (error) {
                console.error("Failed to create keyword cloud:", error);
            }
        };

        fetchEmbeddingsAndSimulate();
    }, [keywords]);

  return (
    <group ref={groupRef}>
      {nodes.map(node => (
        <Sphere key={node.id} node={node} onKeywordClick={onKeywordClick} onKeywordHover={onKeywordHover} />
      ))}
    </group>
  );
};

export default KeywordCloud;
