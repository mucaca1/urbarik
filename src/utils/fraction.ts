export const parseFraction = (input: string): number => {
    const parts = input.split('/');
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0]);
      const denominator = parseFloat(parts[1]);
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
    return parseFloat(input); // fallback
};

  export const isValidFraction = (input: string): boolean => {
    const parts = input.split('/');
    if (parts.length !== 2) return false;
    const [numerator, denominator] = parts.map((p) => parseFloat(p));
    return (
      !isNaN(numerator) &&
      !isNaN(denominator) &&
      denominator !== 0 &&
      /^\s*\d+\s*\/\s*\d+\s*$/.test(input)
    );
};

export const formatFraction = (val: number): string => {
    const tolerance = 1.0e-6;
    let numerator = 1;
    let denominator = 1;
    let error = Math.abs(val - numerator / denominator);

    for (let d = 1; d <= 1000; d++) {
      const n = Math.round(val * d);
      const approx = n / d;
      const err = Math.abs(val - approx);
      if (err < error - tolerance) {
        numerator = n;
        denominator = d;
        error = err;
      }
    }

    return `${numerator}/${denominator}`;
};