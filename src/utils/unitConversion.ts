export type AreaUnit = 'm2' | 'km2' | 'ha';

export function toBaseUnit(value: number, from: AreaUnit): number {
    switch (from) {
        case 'km2': return value * 1_000_000;
        case 'ha': return value * 10_000;
        case 'm2':
        default:
            return value;
    }
}

export function fromBaseUnit(value: number, to: AreaUnit): number {
    switch (to) {
        case 'km2': return value / 1_000_000;
        case 'ha': return value / 10_000;
        case 'm2':
        default:
            return value;
    }
}
