import React from 'react';

export const TechnicalDiagram: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '2px solid #000000',
        borderRadius: '4px',
        padding: '24px',
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: '4px 4px 0px #000000',
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1.5px solid #E7E5E5',
          paddingBottom: '12px',
          marginBottom: '20px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#333333', letterSpacing: '0.05em' }}>
          DOMAIN TOPOLOGY SPECIFICATION
        </span>
        <span
          style={{
            fontSize: '11px',
            backgroundColor: '#FEDE8C',
            padding: '2px 8px',
            borderRadius: '2px',
            fontWeight: 700,
            border: '1px solid #000000',
          }}
        >
          v1.0.0
        </span>
      </div>

      {/* Structured ASCII/SVG Technical Diagram */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {/* ParkingLot Node */}
        <div
          style={{
            backgroundColor: '#F4F3F3',
            border: '1.5px solid #000000',
            borderRadius: '4px',
            padding: '10px 24px',
            textAlign: 'center',
            minWidth: '220px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>ParkingLot</div>
          <div style={{ fontSize: '11px', color: '#666666', marginTop: '2px' }}>
            floors: List&lt;Floor&gt;
          </div>
        </div>

        {/* Downward line */}
        <div style={{ width: '1.5px', height: '16px', backgroundColor: '#000000' }} />
        <div style={{ fontSize: '10px', color: '#666666', fontWeight: 600 }}>1 : N contains</div>
        <div style={{ width: '1.5px', height: '16px', backgroundColor: '#000000' }} />

        {/* Floor Node */}
        <div
          style={{
            backgroundColor: '#F4F3F3',
            border: '1.5px solid #000000',
            borderRadius: '4px',
            padding: '10px 24px',
            textAlign: 'center',
            minWidth: '220px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>Floor</div>
          <div style={{ fontSize: '11px', color: '#666666', marginTop: '2px' }}>
            spots: Map&lt;SpotType, ParkingSpot&gt;
          </div>
        </div>

        {/* Downward line */}
        <div style={{ width: '1.5px', height: '16px', backgroundColor: '#000000' }} />
        <div style={{ fontSize: '10px', color: '#666666', fontWeight: 600 }}>1 : N manages</div>
        <div style={{ width: '1.5px', height: '16px', backgroundColor: '#000000' }} />

        {/* ParkingSpot Node */}
        <div
          style={{
            backgroundColor: '#D5BDFF',
            border: '1.5px solid #000000',
            borderRadius: '4px',
            padding: '10px 24px',
            textAlign: 'center',
            minWidth: '220px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>ParkingSpot</div>
          <div style={{ fontSize: '11px', color: '#333333', marginTop: '2px' }}>
            assignVehicle(v: Vehicle): boolean
          </div>
        </div>

        {/* Association to Vehicle */}
        <div style={{ width: '1.5px', height: '16px', backgroundColor: '#000000' }} />
        <div style={{ fontSize: '10px', color: '#666666', fontWeight: 600 }}>associates with (0..1)</div>
        <div style={{ width: '1.5px', height: '16px', backgroundColor: '#000000' }} />

        {/* Vehicle Node */}
        <div
          style={{
            backgroundColor: '#FEDE8C',
            border: '1.5px solid #000000',
            borderRadius: '4px',
            padding: '10px 24px',
            textAlign: 'center',
            minWidth: '220px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#000000' }}>Vehicle (Abstract)</div>
          <div style={{ fontSize: '11px', color: '#333333', marginTop: '2px' }}>
            license: string, type: VehicleType
          </div>
        </div>
      </div>
    </div>
  );
};
