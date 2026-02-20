import React from 'react';
import { ContinentKey, CONTINENT_LABELS } from '../models/Icon';

interface WorldMapProps {
    onSelect: (continent: ContinentKey) => void;
    activeContinent: ContinentKey | null;
}

const CONTINENTS: { key: ContinentKey; label: string; color: string; d: string; tx: number; ty: number }[] = [
    {
        key: 'north_america', label: 'Сев. Америка', color: '#00bcd4',
        d: 'M50,30 L120,25 L140,60 L130,100 L100,120 L80,110 L60,80 L45,50 Z',
        tx: 80, ty: 70
    },
    {
        key: 'south_america', label: 'Юж. Америка', color: '#4caf50',
        d: 'M100,130 L120,135 L130,170 L125,210 L110,240 L95,230 L85,200 L90,160 Z',
        tx: 108, ty: 185
    },
    {
        key: 'europe', label: 'Европа', color: '#ff9800',
        d: 'M220,30 L260,25 L270,45 L265,70 L240,75 L225,60 L215,45 Z',
        tx: 240, ty: 50
    },
    {
        key: 'africa', label: 'Африка', color: '#f44336',
        d: 'M220,80 L260,75 L275,100 L270,150 L250,180 L230,175 L215,140 L210,100 Z',
        tx: 242, ty: 130
    },
    {
        key: 'asia', label: 'Азия', color: '#9c27b0',
        d: 'M270,25 L350,20 L380,50 L370,90 L340,100 L300,95 L275,70 Z',
        tx: 325, ty: 60
    },
    {
        key: 'cis', label: 'СНГ', color: '#2196f3',
        d: 'M260,28 L310,20 L330,35 L320,55 L290,60 L270,50 Z',
        tx: 292, ty: 42
    },
    {
        key: 'australia', label: 'Австралия', color: '#ffeb3b',
        d: 'M340,150 L380,145 L395,170 L385,195 L355,200 L340,180 Z',
        tx: 365, ty: 172
    }
];

const WorldMap: React.FC<WorldMapProps> = ({ onSelect, activeContinent }) => {
    return (
        <svg viewBox="0 0 430 260" style={{ width: '100%', height: 'auto' }}>
            <rect width="430" height="260" fill="#0a0a1a" rx="12" />
            {CONTINENTS.map(c => (
                <g key={c.key} onClick={() => onSelect(c.key)} style={{ cursor: 'pointer' }}>
                    <path
                        d={c.d}
                        fill={activeContinent === c.key ? c.color + '33' : 'transparent'}
                        stroke={c.color}
                        strokeWidth={activeContinent === c.key ? 2.5 : 1.5}
                        opacity={activeContinent === c.key ? 1 : 0.7}
                    />
                    <text
                        x={c.tx} y={c.ty}
                        fill={c.color}
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                        style={{ pointerEvents: 'none' }}
                    >
                        {c.label}
                    </text>
                </g>
            ))}
            <text x="215" y="252" fill="rgba(255,255,255,0.3)" fontSize="7" textAnchor="middle">
                Выберите регион
            </text>
        </svg>
    );
};

export default WorldMap;
