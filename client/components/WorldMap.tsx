import React from 'react';
import { ContinentKey } from '../models/Icon';

interface WorldMapProps {
    onSelect: (continent: ContinentKey) => void;
    activeContinent: ContinentKey | null;
}

const CONTINENTS: { key: ContinentKey; label: string; color: string; paths: string[]; tx: number; ty: number }[] = [
    {
        key: 'north_america', label: 'N. America', color: '#ff4444',
        paths: [
            'M135,55 L138,48 L148,42 L162,38 L175,32 L182,28 L192,30 L198,36 L195,42 L188,44 L178,50 L170,56 L165,62 L158,72 L150,80 L145,88 L138,95 L130,100 L125,95 L118,88 L112,82 L108,75 L110,68 L118,62 L128,58 Z',
            'M190,25 L200,22 L215,18 L228,16 L235,20 L238,28 L235,35 L228,38 L220,36 L210,32 L200,30 Z',
            'M120,100 L125,96 L130,102 L128,108 L122,110 L118,106 Z',
        ],
        tx: 155, ty: 58
    },
    {
        key: 'south_america', label: 'S. America', color: '#ff8800',
        paths: [
            'M160,128 L165,122 L172,120 L178,124 L182,132 L184,142 L183,152 L180,162 L176,172 L170,182 L164,192 L158,200 L152,206 L148,202 L145,195 L143,185 L142,175 L144,165 L148,155 L152,145 L155,135 Z',
        ],
        tx: 165, ty: 165
    },
    {
        key: 'europe', label: 'Europe', color: '#ffdd00',
        paths: [
            'M310,42 L315,38 L322,35 L330,33 L338,35 L342,38 L345,32 L350,30 L355,33 L352,38 L348,42 L345,48 L340,52 L335,56 L328,58 L322,60 L316,58 L312,54 L308,48 Z',
            'M300,28 L305,25 L310,28 L308,33 L302,34 Z',
            'M348,48 L352,44 L358,42 L362,46 L360,52 L354,54 L350,52 Z',
        ],
        tx: 332, ty: 42
    },
    {
        key: 'africa', label: 'Africa', color: '#00cc66',
        paths: [
            'M310,68 L318,64 L328,62 L338,64 L345,68 L350,74 L354,82 L356,92 L355,102 L352,112 L348,120 L342,128 L335,134 L328,138 L320,136 L314,130 L310,122 L305,114 L302,104 L300,94 L302,84 L305,76 Z',
            'M340,66 L346,64 L352,68 L350,72 L344,70 Z',
        ],
        tx: 330, ty: 100
    },
    {
        key: 'asia', label: 'Asia', color: '#cc44ff',
        paths: [
            'M370,28 L380,24 L395,20 L410,18 L425,16 L440,18 L452,22 L460,28 L465,36 L468,44 L465,52 L460,58 L452,64 L442,68 L432,72 L420,74 L408,72 L398,68 L390,62 L382,56 L375,48 L370,40 Z',
            'M440,72 L448,68 L456,70 L460,76 L458,82 L452,86 L445,88 L438,85 L435,78 Z',
            'M462,78 L470,74 L478,76 L482,82 L478,88 L470,90 L464,86 Z',
        ],
        tx: 420, ty: 45
    },
    {
        key: 'cis', label: 'CIS', color: '#4488ff',
        paths: [
            'M355,22 L365,18 L378,16 L392,14 L408,12 L425,10 L442,12 L455,16 L462,22 L458,26 L448,28 L435,26 L420,24 L405,22 L390,20 L378,22 L368,26 L360,28 Z',
        ],
        tx: 405, ty: 18
    },
    {
        key: 'australia', label: 'Oceania', color: '#ff44aa',
        paths: [
            'M445,118 L455,114 L468,112 L480,115 L488,122 L492,132 L488,142 L480,148 L468,150 L458,148 L450,142 L445,134 L443,126 Z',
            'M495,145 L500,142 L505,145 L503,150 L498,152 Z',
        ],
        tx: 468, ty: 132
    },
];

const WorldMap: React.FC<WorldMapProps> = ({ onSelect, activeContinent }) => {
    return (
        <svg viewBox="0 0 540 220" style={{ width: '100%', height: 'auto' }}>
            <defs>
                {CONTINENTS.map(c => (
                    <filter key={`glow-${c.key}`} id={`glow-${c.key}`}>
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                ))}
            </defs>
            <rect width="540" height="220" fill="#0a0a1a" rx="12" />
            {/* Grid dots */}
            {Array.from({ length: 18 }, (_, i) =>
                Array.from({ length: 8 }, (_, j) => (
                    <circle key={`dot-${i}-${j}`} cx={30 * i + 15} cy={28 * j + 10} r="0.5" fill="rgba(100,150,255,0.08)" />
                ))
            )}
            {CONTINENTS.map(c => {
                const isActive = activeContinent === c.key;
                return (
                    <g
                        key={c.key}
                        onClick={() => onSelect(c.key)}
                        style={{ cursor: 'pointer' }}
                        filter={isActive ? `url(#glow-${c.key})` : undefined}
                    >
                        {c.paths.map((d, i) => (
                            <path
                                key={i}
                                d={d}
                                fill={isActive ? c.color + '22' : c.color + '0a'}
                                stroke={c.color}
                                strokeWidth={isActive ? 1.8 : 0.8}
                                opacity={isActive ? 1 : 0.65}
                            />
                        ))}
                        <text
                            x={c.tx} y={c.ty}
                            fill={isActive ? c.color : 'rgba(255,255,255,0.4)'}
                            fontSize="6"
                            fontWeight={isActive ? 'bold' : 'normal'}
                            textAnchor="middle"
                            style={{ pointerEvents: 'none', textShadow: isActive ? `0 0 6px ${c.color}` : 'none' }}
                        >
                            {c.label}
                        </text>
                    </g>
                );
            })}
            <text x="270" y="214" fill="rgba(255,255,255,0.2)" fontSize="6" textAnchor="middle">
                Tap a region to explore mining sites
            </text>
        </svg>
    );
};

export default WorldMap;
