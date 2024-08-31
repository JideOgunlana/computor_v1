type Term = {
    coefficient: number;
    exponent: number;
}

class PolynomialSolver {
    private equation: string;
    private terms: Term[];

    constructor(equation: string) {
        this.equation = equation;
        this.terms = [];
    }

    
    // Parse the input equation and return the terms
    parseEquation(): void {
        let [lhs, rhs] = this.equation.split("=");
        if (!lhs || !rhs) throw new Error("Equation is not valid: missing '=' symbol.");

        const parseSide = (side: string): Term[] => {
            // enforce the format "coefficient * X^exponent"
            const regex = /([+-]?\s*\d*\.?\d+)\s*\*\s*X\^(\d+)/g;
            let terms: Term[] = [];
            let match;

            // While there are matches in the side (lhs or rhs)
            while ((match = regex.exec(side)) !== null) {
                let coefficient = parseFloat(match[1]?.replace(/\s+/g, "") || "1");
                let exponent = parseInt(match[2], 10);

                if (isNaN(coefficient) || isNaN(exponent))
                    throw new Error("Equation not valid: invalid coefficient or exponent.");

                terms.push({ coefficient, exponent });
            }

            // If no valid matches found, the side has invalid format
            if (terms.length === 0)
                throw new Error("Equation is not valid: All terms must be in the form 'coefficient * X^n'.");

            return terms;
        };

        const lhsTerms = parseSide(lhs);
        if (rhs.trim() === '0') rhs = '0 * X^0';
        const rhsTerms = parseSide(rhs).map((term) => ({
            coefficient: -term.coefficient,
            exponent: term.exponent,
        }));

        this.terms = [...lhsTerms, ...rhsTerms];

        // Combine like terms
        
    }
}