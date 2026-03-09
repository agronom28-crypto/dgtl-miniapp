import React, { useEffect, useRef, useCallback } from 'react';
import { ContinentKey } from '../models/Icon';

interface WorldMapProps {
    onSelect: (continent: ContinentKey) => void;
    activeContinent: ContinentKey | null;
}

const CONTINENT_COUNTRIES: Record<ContinentKey, string[]> = {
    north_america: ['us','ca','mx','gt','bz','hn','sv','ni','cr','pa','cu','jm','ht','do','pr','bs','tt','gl'],
    south_america: ['br','ar','cl','co','pe','ve','ec','bo','py','uy','gy','sr','fk'],
    europe: ['gb','fr','de','it','es','pt','nl','be','ch','at','se','no','fi','dk','ie','is','pl','cz','sk','hu','ro','bg','hr','rs','ba','me','mk','al','gr','cy','ee','lv','lt','si','lu','mt'],
    africa: ['eg','dz','ly','tn','ma','eh','mr','ml','ne','td','sd','ss','er','dj','so','et','ke','ug','tz','mz','mg','zm','zw','bw','na','za','ls','ao','cd','cg','ga','gq','cm','ng','bj','tg','gh','ci','lr','sl','gn','gw','sn','gm','bf','rw','bi','mw'],
    asia: ['cn','jp','kr','kp','mn','in','pk','bd','lk','np','bt','mm','th','vn','la','kh','my','sg','id','ph','tw','bn','tl','sa','ae','om','ye','iq','ir','sy','jo','il','lb','ps','tr','ge','az','am','af','tj','kg','qa','kw'],
    russia: ['ru'],
    australia: ['au','nz','pg','fj','sb','vu','nc','tf']
};

const NEUTRAL_COUNTRIES = ['ua','by','kz','uz','tm','md'];

const CONTINENT_COLORS: Record<ContinentKey, string> = {
    north_america: '#ff4444',
    south_america: '#ff8800',
    europe: '#ffdd00',
    africa: '#00cc66',
    asia: '#cc44ff',
    russia: '#4488ff',
    australia: '#ff44aa'
};

const NEUTRAL_COLOR = '#334455';

const COUNTRY_TO_CONTINENT: Record<string, ContinentKey> = {};
for (const [continent, codes] of Object.entries(CONTINENT_COUNTRIES)) {
    for (const code of codes) {
        COUNTRY_TO_CONTINENT[code] = continent as ContinentKey;
    }
}

function hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
}

const SVG_URL = 'https://raw.githubusercontent.com/flekschas/simple-world-map/master/world-map.svg';

const WorldMap: React.FC<WorldMapProps> = (props) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click via React event delegation on the container div
    const handleContainerClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        let target = e.target as Element | null;
        // Walk up from clicked element to find group with data-continent
        while (target && target !== e.currentTarget) {
            const continent = target.getAttribute?.('data-continent');
            if (continent) {
                props.onSelect(continent as ContinentKey);
                return;
            }
            target = target.parentElement;
        }
    }, [props.onSelect]);

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

                container.innerHTML = '';
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('viewBox', svgEl.getAttribute('viewBox') || '30.767 241.591 784.077 458.627');
                svg.setAttribute('width', '100%');
                svg.setAttribute('height', '100%');
                svg.style.background = '#0a0e1a';
                svg.style.borderRadius = '12px';

                const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
                Object.entries(CONTINENT_COLORS).forEach(([key, color]) => {
                    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
                    filter.setAttribute('id', `glow-${key}`);
                    filter.setAttribute('x', '-50%'); filter.setAttribute('y', '-50%');
                    filter.setAttribute('width', '200%'); filter.setAttribute('height', '200%');
                    const blur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
                    blur.setAttribute('stdDeviation', '2'); blur.setAttribute('result', 'blur');
                    const merge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
                    const mn1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
                    const mn2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
                    mn1.setAttribute('in', 'blur');
                    mn2.setAttribute('in', 'SourceGraphic');
                    merge.appendChild(mn1); merge.appendChild(mn2);
                    filter.appendChild(blur); filter.appendChild(merge);
                    defs.appendChild(filter);
                });
                svg.appendChild(defs);

                const groups: Record<string, SVGElement[]> = {};
                const neutralPaths: SVGElement[] = [];
                svgEl.querySelectorAll('path').forEach(path => {
                    let code = path.getAttribute('id') || '';
                    if (!code) {
                        const pg = path.parentElement;
                        if (pg && pg.tagName === 'g') code = pg.getAttribute('id') || '';
                    }
                    code = code.toLowerCase();
                    if (NEUTRAL_COUNTRIES.includes(code)) {
                        neutralPaths.push(path as unknown as SVGElement);
                    } else {
                        const cont = COUNTRY_TO_CONTINENT[code];
                        if (cont) { if (!groups[cont]) groups[cont] = []; groups[cont].push(path as unknown as SVGElement); }
                    }
                });

                if (neutralPaths.length) {
                    const ng = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    neutralPaths.forEach(op => {
                        const np = op.cloneNode(true) as SVGElement;
                        np.setAttribute('fill', NEUTRAL_COLOR); np.setAttribute('fill-opacity', '0.15');
                        np.setAttribute('stroke', NEUTRAL_COLOR); np.setAttribute('stroke-width', '0.5');
                        np.setAttribute('opacity', '0.5'); np.removeAttribute('id');
                        ng.appendChild(np);
                    });
                    svg.appendChild(ng);
                }

                Object.entries(CONTINENT_COLORS).forEach(([key, color]) => {
                    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    g.setAttribute('data-continent', key);
                    g.style.cursor = 'pointer';
                    const isActive = props.activeContinent === key;
                    g.setAttribute('filter', `url(#glow-${key})`);
                    (groups[key] || []).forEach(op => {
                        const np = op.cloneNode(true) as SVGElement;
                        np.setAttribute('fill', hexToRgba(color, isActive ? 0.35 : 0.15));
                        np.setAttribute('stroke', color);
                        np.setAttribute('stroke-width', isActive ? '1.5' : '0.8');
                        np.setAttribute('opacity', isActive ? '1' : '0.85');
                        np.style.pointerEvents = 'all';
                        np.removeAttribute('id');
                        g.appendChild(np);
                    });
                    // Hover effects
                    g.addEventListener('mouseenter', () => {
                        g.querySelectorAll('path').forEach(p => {
                            p.setAttribute('fill', hexToRgba(color, 0.4));
                            p.setAttribute('stroke-width', '1.5');
                        });
                    });
                    g.addEventListener('mouseleave', () => {
                        if (props.activeContinent !== key) {
                            g.querySelectorAll('path').forEach(p => {
                                p.setAttribute('fill', hexToRgba(color, 0.15));
                                p.setAttribute('stroke-width', '0.8');
                            });
                        }
                    });
                    svg.appendChild(g);
                });
                container.appendChild(svg);
            })
            .catch(err => console.error('Failed to load world map SVG:', err));
        return () => { cancelled = true; };
    }, [props.activeContinent]);

    return (
        <div
            ref={containerRef}
            onClick={handleContainerClick}
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
