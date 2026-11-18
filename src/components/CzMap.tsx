import type { KeyboardEvent } from 'react';
import { MAP_LABELS, MAP_OUTLINE, MAP_REGIONS, MAP_STATES, MAP_VIEWBOX } from '../content/vlastiveda/mapa-kraju';
import type { KrajId } from '../content/vlastiveda/kraje-data';

/** Jak je kraj vybarvený: hledaný (žlutě), správně (zeleně), špatně (červeně). */
export type MapTone = 'focus' | 'ok' | 'bad';

interface Props {
  /** Popis mapy pro čtečky obrazovky. */
  label: string;
  tones?: Partial<Record<string, MapTone>>;
  /** Kliknutí na kraj. Když chybí, mapa je jen obrázek. */
  onPick?: (id: KrajId) => void;
  /** Čísla v krajích (tahák). */
  numbers?: Partial<Record<string, number>>;
  /** Bez popisků sousedních států (malá mapa v přehledu chyb). */
  bare?: boolean;
  className?: string;
}

// Praha se kreslí až nakonec, aby ležela nad Středočeským krajem.
const IDS = (Object.keys(MAP_REGIONS) as KrajId[]).sort((a, b) => Number(a === 'praha') - Number(b === 'praha'));

/** Slepá mapa ČR s kraji. */
export function CzMap({ label, tones = {}, onPick, numbers, bare, className }: Props) {
  const pickable = !!onPick;
  const key = (id: KrajId) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPick?.(id);
    }
  };

  return (
    <svg
      className={['czmap', pickable ? 'pick' : '', className ?? ''].join(' ').trim()}
      viewBox={MAP_VIEWBOX}
      role={pickable ? 'group' : 'img'}
      aria-label={label}
    >
      {!bare &&
        MAP_STATES.map(([name, x, y], i) => (
          <text key={i} className="map-state" x={x} y={y} aria-hidden="true">
            {name}
          </text>
        ))}
      {IDS.map((id, i) => (
        <path
          key={id}
          d={MAP_REGIONS[id]}
          className={`map-region ${tones[id] ?? ''}`.trim()}
          fillRule="evenodd"
          {...(pickable
            ? {
                role: 'button',
                tabIndex: 0,
                'aria-label': `Kraj číslo ${i + 1}`,
                onClick: () => onPick(id),
                onKeyDown: key(id),
              }
            : {})}
        />
      ))}
      {pickable && (
        // Praha je malá, tak má na dotyk větší plochu.
        <circle
          className="map-hit"
          cx={MAP_LABELS.praha[0]}
          cy={MAP_LABELS.praha[1]}
          r={30}
          onClick={() => onPick('praha')}
          aria-hidden="true"
        />
      )}
      <path className="map-outline" d={MAP_OUTLINE} aria-hidden="true" />
      {numbers &&
        IDS.filter((id) => numbers[id] !== undefined).map((id) => (
          <g key={id} className="map-num" aria-hidden="true">
            <circle cx={MAP_LABELS[id][0]} cy={MAP_LABELS[id][1]} r={25} />
            <text x={MAP_LABELS[id][0]} y={MAP_LABELS[id][1]}>
              {numbers[id]}
            </text>
          </g>
        ))}
    </svg>
  );
}
