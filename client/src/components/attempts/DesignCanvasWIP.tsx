import React, { useState } from 'react';
import { Tape } from '../landing/TactileAccents';

export interface CanvasNode {
  id: string;
  type: 'class' | 'interface';
  name: string;
  items: string[];
  x: number;
  y: number;
}

export const DesignCanvasWIP: React.FC = () => {
  const [nodes, setNodes] = useState<CanvasNode[]>([
    {
      id: 'node-1',
      type: 'class',
      name: 'ParkingLot',
      items: ['floors: List<Floor>', 'issueTicket(v: Vehicle)', 'checkout(t: Ticket)'],
      x: 30,
      y: 40,
    },
    {
      id: 'node-2',
      type: 'class',
      name: 'Floor',
      items: ['level: int', 'spots: Map<SpotType, Spot>', 'findNearestSpot()'],
      x: 320,
      y: 40,
    },
    {
      id: 'node-3',
      type: 'class',
      name: 'ParkingSpot',
      items: ['spotId: String', 'type: SpotType', 'isOccupied: boolean'],
      x: 320,
      y: 220,
    },
    {
      id: 'node-4',
      type: 'interface',
      name: 'IPricingStrategy',
      items: ['calculateFee(hours: double)', 'applyDiscount(d: Code)'],
      x: 30,
      y: 220,
    },
  ]);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (id: string, e: React.MouseEvent) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    setDraggingId(id);
    setOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === draggingId) {
          return {
            ...n,
            x: Math.max(10, Math.min(e.clientX - offset.x, 600)),
            y: Math.max(10, Math.min(e.clientY - offset.y, 340)),
          };
        }
        return n;
      })
    );
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const addClassNode = () => {
    const newId = `node-${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        type: 'class',
        name: `NewClass${prev.length + 1}`,
        items: ['state: Property', 'operation(): void'],
        x: 100 + (prev.length % 3) * 60,
        y: 80 + (prev.length % 2) * 50,
      },
    ]);
  };

  const addInterfaceNode = () => {
    const newId = `node-${Date.now()}`;
    setNodes((prev) => [
      ...prev,
      {
        id: newId,
        type: 'interface',
        name: `IContract${prev.length + 1}`,
        items: ['execute(): boolean'],
        x: 120 + (prev.length % 3) * 50,
        y: 100 + (prev.length % 2) * 60,
      },
    ]);
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #000000',
        borderRadius: '2px',
        boxShadow: '4px 4px 0px #000000',
        padding: '20px',
        marginBottom: '32px',
        position: 'relative',
      }}
    >
      <Tape rotation={-2} style={{ top: '-10px', left: '28px' }} />

      {/* Header with WIP banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1.5px solid #000000',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 800,
              backgroundColor: '#FEDE8C',
              padding: '2px 8px',
              border: '1.5px solid #000000',
              boxShadow: '1px 1px 0px #000000',
            }}
          >
            VISUAL CANVAS — WORK IN PROGRESS
          </span>
          <span className="font-hand" style={{ fontSize: '18px', color: '#444444' }}>
            drag & model your system visually
          </span>
        </div>

        {/* Node Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={addClassNode}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #000000',
              padding: '4px 10px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px #000000',
            }}
          >
            + ADD CLASS
          </button>
          <button
            type="button"
            onClick={addInterfaceNode}
            style={{
              backgroundColor: '#D5BDFF',
              border: '1.5px solid #000000',
              padding: '4px 10px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '1.5px 1.5px 0px #000000',
            }}
          >
            + ADD INTERFACE
          </button>
        </div>
      </div>

      {/* Notice regarding submission scope */}
      <div
        style={{
          fontSize: '12px',
          color: '#555555',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: '12px',
        }}
      >
        <span>* Note: The visual canvas is an interactive scratchpad. The </span>
        <strong style={{ color: '#000000' }}>Structured Specification below</strong>
        <span> is the evaluated submission sent to the engine.</span>
      </div>

      {/* Interactive Interactive Graph Surface */}
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          width: '100%',
          height: '420px',
          border: '1.5px solid #000000',
          backgroundColor: '#F4F3F3',
          backgroundImage:
            'linear-gradient(to right, #E7E5E5 1px, transparent 1px), linear-gradient(to bottom, #E7E5E5 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          position: 'relative',
          overflow: 'hidden',
          userSelect: 'none',
        }}
      >
        {/* Render nodes */}
        {nodes.map((node) => {
          const isInterface = node.type === 'interface';
          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(node.id, e)}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '210px',
                backgroundColor: isInterface ? '#D5BDFF' : '#FFFFFF',
                border: '2px solid #000000',
                borderRadius: '3px',
                boxShadow: '3px 3px 0px #000000',
                cursor: draggingId === node.id ? 'grabbing' : 'grab',
                zIndex: draggingId === node.id ? 20 : 10,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <div
                style={{
                  padding: '6px 10px',
                  borderBottom: '1.5px solid #000000',
                  backgroundColor: isInterface ? '#CCB4F5' : '#FEDE8C',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                  {node.type}
                </span>
                <span style={{ fontSize: '12px', fontWeight: 900, color: '#000000' }}>
                  {node.name}
                </span>
              </div>
              <div style={{ padding: '8px 10px', fontSize: '11px', lineHeight: 1.4, color: '#222222' }}>
                {node.items.map((item, idx) => (
                  <div key={idx} style={{ marginBottom: '2px' }}>
                    • {item}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
