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
        this.reduceEquation();
    }

    // Reduce the equation to its simplified form
    reduceEquation(): void {
        const reducedTerms: { [exponent: number]: number } = {};

        this.terms.forEach((term) => {
            if (reducedTerms[term.exponent] !== undefined) {
                reducedTerms[term.exponent] += term.coefficient;
            } else {
                reducedTerms[term.exponent] = term.coefficient;
            }
        });

        this.terms = Object.keys(reducedTerms)
            .map((exp) => ({
                coefficient: reducedTerms[parseInt(exp)],
                exponent: parseInt(exp),
            }))
            .filter((term) => term.coefficient !== 0 || term.exponent === 0);

        this.printReducedForm();
    }

    // Print the reduced form of the equation
    printReducedForm(): void {
        const reducedForm = this.terms
            .map((term) => {
                const sign = term.coefficient < 0 ? "-" : "+";
                const absCoefficient = Math.abs(term.coefficient);
                return `${sign} ${absCoefficient} * X^${term.exponent}`;
            })
            .join(" ")
            .replace(/\+ -/g, "- ")
            .trim()
            .replace(/^\+/, ""); // Remove leading +

        console.log(`Reduced form: ${reducedForm || "0"} = 0`);
    }

    // Find the degree of the polynomial
    getDegree(): number {
        const degree = Math.max(...this.terms.map((term) => term.exponent));
        console.log(`Polynomial degree: ${degree}`);
        return degree;
    }
}