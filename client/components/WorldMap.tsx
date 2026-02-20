import React, { useEffect, useRef, useCallback } from 'react';
import { ContinentKey } from '../models/Icon';

interface WorldMapProps {
    onSelect: (continent: ContinentKey) => void;
    activeContinent: ContinentKey | null;
}

// ISO 3166-1 alpha-2 codes grouped by our continent regions
const CONTINENT_COUNTRIES: Record<ContinentKey, string[]> = {
    north_america: [
        'us','ca','mx','gt','bz','hn','sv','ni','cr','pa',
        'cu','jm','ht','do','pr','bs','tt','gl'
    ],
    south_america: [
        'br','ar','cl','co','pe','ve','ec','bo','py','uy',
        'gy','sr','fk','gf'
    ],
    europe: [
        'gb','fr','de','it','es','pt','nl','be','ch','at',
        'se','no','fi','dk','ie','is','pl','cz','sk','hu',
        'ro','bg','hr','rs','ba','me','mk','al','gr','cy',
        'ee','lv','lt','si','lu','mt'
    ],
    africa: [
        'eg','dz','ly','tn','ma','eh','mr','ml','ne','td',
        'sd','ss','er','dj','so','et','ke','ug','tz','mz',
        'mg','zm','zw','bw','na','za','sz','ls','ao','cd',
        'cg','ga','gq','cm','ng','bj','tg','gh','ci','lr',
        'sl','gn','gw','sn','gm','bf','rw','bi','mw'
    ],
    asia: [
        'cn','jp','kr','kp','mn','in','pk','bd','lk','np',
        'bt','mm','th','vn','la','kh','my','sg','id','ph',
        'tw','bn','tl','sa','ae','om','ye','iq','ir','sy',
        'jo','il','lb','ps','tr','ge','az','am','af','tj',
        'kg','qa','kw','bh'
    ],
    cis: [
        'ru','kz','uz','tm','ua','by','md'
    ],
    australia: [
        'au','nz','pg','fj','sb','vu','nc','tf'
    ]
};

const CONTINENT_COLORS: Record<ContinentKey, string> = {
    north_america: '#ff4444',
    south_america: '#ff8800',
    europe: '#ffdd00',
    africa: '#00cc66',
    asia: '#cc44ff',
    cis: '#4488ff',
    australia: '#ff44aa'
};

const CONTINENT_LABELS: Record<ContinentKey, string> = {
    north_america: 'N. America',
    south_america: 'S. America',
    europe: 'Europe',
    africa: 'Africa',
    asia: 'Asia',
    cis: 'CIS',
    australia: 'Oceania'
};

// Build reverse lookup: country code -> continent
const COUNTRY_TO_CONTINENT: Record<string, ContinentKey> = {};
for (const [continent, codes] of Object.entries(CONTINENT_COUNTRIES)) {
    for (const code of codes) {
        COUNTRY_TO_CONTINENT[code] = continent as ContinentKey;
    }
}

const SVG_URL = 'https://raw.githubusercontent.com/flekschas/simple-world-map/master/world-map.svg';

const WorldMap: React.FC<WorldMapProps> = ({ onSelect, activeContinent }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const handlePathClick = useCallback((continent: ContinentKey) => {
        onSelect(continent);
    }, [onSelect]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let cancelled = false;

        fetch(SVG_URL)
            .then(r => r.text())
            .then(svgText => {
                if (cancelled) return;

                const parser = new DOMParser();
                const doc = parser.parseFromString(svgText, 'image/svg+xml');
                const svgEl = doc.querySelector('svg');
                if (!svgEl) return;

                // Clear container
                container.innerHTML = '';

                // Create new SVG
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', svgEl.getAttribute('viewBox') || '30.767 241.591 784.077 458.627');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.background = '#0a0e1a';
                svg.style.borderRadius = '12px';

                // Add glow filter
                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                Object.entries(CONTINENT_COLORS).forEach(([key, color]) => {
                    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    filter.setAttribute('id', `glow-${key}`);
                    filter.setAttribute('x', '-50%');
                    filter.setAttribute('y', '-50%');
                    filter.setAttribute('width', '200%');
                    filter.setAttribute('height', '200%');
                    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                    blur.setAttribute('stdDeviation', '3');
                    blur.setAttribute('result', 'blur');
                    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
                    const mn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
                    mn1.setAttribute('in', 'blur');
                    const mn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
                    mn2.setAttribute('in', 'SourceGraphic');
                    merge.appendChild(mn1);
                    merge.appendChild(mn2);
                    filter.appendChild(blur);
                    filter.appendChild(merge);
                    defs.appendChild(filter);
                });
                svg.appendChild(defs);

                // Group paths by continent
                const groups: Record<string, SVGElement[]> = {};
                const allPaths = svgEl.querySelectorAll('path');

                allPaths.forEach(path => {
                    // Get country code from path id or parent g id
                    let code = path.getAttribute('id') || '';
                    if (!code) {
                        const parentG = path.parentElement;
                        if (parentG && parentG.tagName === 'g') {
                            code = parentG.getAttribute('id') || '';
                        }
                    }
                    code = code.toLowerCase();
                    const continent = COUNTRY_TO_CONTINENT[code];
                    if (continent) {
                        if (!groups[continent]) groups[continent] = [];
                        groups[continent].push(path as unknown as SVGElement);
                    }
                });

                // Render continent groups
                Object.entries(CONTINENT_COLORS).forEach(([key, color]) => {
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    g.setAttribute('data-continent', key);
                    g.style.cursor = 'pointer';

                    const isActive = activeContinent === key;
                    if (isActive) {
                        g.setAttribute('filter', `url(#glow-${key})`);
                    }

                    const paths = groups[key] || [];
                    paths.forEach(origPath => {
                        const newPath = origPath.cloneNode(true) as SVGElement;
                        newPath.setAttribute('fill', 'none');
                        newPath.setAttribute('stroke', color);
                        newPath.setAttribute('stroke-width', isActive ? '1.5' : '0.8');
                        newPath.setAttribute('opacity', isActive ? '1' : '0.75');
                        newPath.removeAttribute('id');
                        g.appendChild(newPath);
                    });

                    g.addEventListener('click', () => {
                        const ck = key as ContinentKey;
                        handlePathClick(ck);
                    });

                    svg.appendChild(g);
                });

                // Add continent labels
                const labelPositions: Record<string, [number, number]> = {
                    north_america: [180, 380],
                    south_america: [260, 560],
                    europe: [470, 340],
                    africa: [470, 500],
                    asia: [620, 380],
                    cis: [580, 310],
                    australia: [680, 560]
                };

                Object.entries(labelPositions).forEach(([key, [x, y]]) => {
                    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                    text.setAttribute('x', String(x));
                    text.setAttribute('y', String(y));
                    text.setAttribute('fill', CONTINENT_COLORS[key as ContinentKey]);
                    text.setAttribute('font-size', '14');
                    text.setAttribute('text-anchor', 'middle');
                    text.setAttribute('font-family', 'sans-serif');
                    text.setAttribute('opacity', activeContinent === key ? '1' : '0.7');
                    text.setAttribute('pointer-events', 'none');
                    text.textContent = CONTINENT_LABELS[key as ContinentKey];
                    svg.appendChild(text);
                });

                // Hint text
                const hint = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                hint.setAttribute('x', '422');
                hint.setAttribute('y', '690');
                hint.setAttribute('fill', 'rgba(255,255,255,0.2)');
                hint.setAttribute('font-size', '10');
                hint.setAttribute('text-anchor', 'middle');
                hint.setAttribute('font-family', 'sans-serif');
                hint.textContent = 'Tap a region to explore mining sites';
                svg.appendChild(hint);

                container.appendChild(svg);
            })
            .catch(err => {
                console.error('Failed to load world map SVG:', err);
            });

        return () => { cancelled = true; };
    }, [activeContinent, handlePathClick]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                maxWidth: 600,
                margin: '0 auto',
                aspectRatio: '784 / 459',
                background: '#0a0e1a',
                borderRadius: 12,
                overflow: 'hidden'
            }}
        />
    );
};

export default WorldMap;
