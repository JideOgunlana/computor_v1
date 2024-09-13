type Term = {
    coefficient: number;
    exponent: number;
};

export class PolynomialSolver {
    private equation: string;
    private terms: Term[];

    constructor(equation: string) {
        this.equation = equation;
        this.terms = [];
        this.validateEquation();  // Validate equation on instantiation
        this.parseEquation();     // Parse equation if valid
    }

    // Validate the format of the polynomial equation
    private validateEquation(): void {
        // Regular expression to match terms of the form coefficient * X^n
        const termPattern = /^\s*(-?\d+(\.\d+)?)\s*\*\s*X\^(-?\d+)\s*$/;
        const sides = this.equation.split('=');
        
        if (sides.length !== 2) {
            throw new Error("Equation must contain exactly one '=' symbol.");
        }

        const [lhs, rhs] = sides.map(side => side.trim());

        const validateSide = (side: string): boolean => {
            const terms = side.split(/(\+|\-)/).filter(term => term.trim() !== "");
            for (let i = 0; i < terms.length; i += 2) {
                const term = terms[i].trim();
                if (!termPattern.test(term)) {
                    return false;
                }
            }
            return true;
        };

        if (!validateSide(lhs) || !validateSide(rhs)) {
            throw new Error("Equation is not valid: All terms must be in the form 'coefficient * X^n'.");
        }
    }

    // Parse the input equation and return the terms
    private parseEquation(): void {
        let [lhs, rhs] = this.equation.split("=");
        if (!lhs || !rhs) throw new Error("Equation is not valid: missing '=' symbol.");

        const parseSide = (side: string): Term[] => {
            const regex = /([+-]?\s*\d*\.?\d+)\s*\*\s*X\^(\d+)/g;
            let terms: Term[] = [];
            let match;

            while ((match = regex.exec(side)) !== null) {
                let coefficient = parseFloat(match[1]?.replace(/\s+/g, "") || "1");
                let exponent = parseInt(match[2], 10);

                if (isNaN(coefficient) || isNaN(exponent))
                    throw new Error("Equation not valid: invalid coefficient or exponent.");

                terms.push({ coefficient, exponent });
            }

            if (terms.length === 0)
                throw new Error("Equation is not valid: All terms must be in the form 'coefficient * X^n'.");

            return terms;
        };

        const lhsTerms = parseSide(lhs);
        const rhsTerms = parseSide(rhs).map(term => ({
            coefficient: -term.coefficient,
            exponent: term.exponent,
        }));

        this.terms = [...lhsTerms, ...rhsTerms];

        // Combine like terms
        this.reduceEquation();
    }

    // Reduce the equation to its simplified form
    private reduceEquation(): void {
        const reducedTerms: { [exponent: number]: number } = {};

        this.terms.forEach(term => {
            if (reducedTerms[term.exponent] !== undefined) {
                reducedTerms[term.exponent] += term.coefficient;
            } else {
                reducedTerms[term.exponent] = term.coefficient;
            }
        });

        this.terms = Object.keys(reducedTerms)
            .map(exp => ({
                coefficient: reducedTerms[parseInt(exp)],
                exponent: parseInt(exp),
            }))
            .filter(term => term.coefficient !== 0 || term.exponent === 0);

        this.printReducedForm();
    }

    // Print the reduced form of the equation
    private printReducedForm(): void {
        const reducedForm = this.terms
            .map(term => {
                const sign = term.coefficient < 0 ? "-" : "+";
                const absCoefficient = Math.abs(term.coefficient);
                return `${sign} ${absCoefficient} * X^${term.exponent}`;
            })
            .join(" ")
            .replace(/\+ -/g, "- ")
            .trim()
            .replace(/^\+/, ""); // Remove leading +

        console.log(`Reduced form:${reducedForm || "0"} = 0`);
    }

    // Find the degree of the polynomial
    getDegree(): number {
        const degree = Math.max(...this.terms.map(term => term.exponent));
        console.log(`Polynomial degree: ${degree}`);
        return degree;
    }

    // Solve the equation based on the degree
    solveEquation(): void {
        const degree = this.getDegree();

        if (degree > 2) {
            console.log("The polynomial degree is strictly greater than 2, I can't solve.");
            return;
        }

        switch (degree) {
            case 1:
                this.solveLinear();
                break;
            case 2:
                this.solveQuadratic();
                break;
            default:
                this.solveZeroDegree();
        }
    }

    // degree - 1
    private solveLinear(): void {
        const a = this.terms.find(term => term.exponent === 1)?.coefficient || 0;
        const b = this.terms.find(term => term.exponent === 0)?.coefficient || 0;

        if (a === 0) {
            if (b === 0) {
                console.log("Each real number is a solution.");
            } else {
                console.log("No solution exists.");
            }
        } else {
            const solution = -b / a;
            console.log(`The solution is: ${solution.toFixed(6)}`);
        }
    }

    // degree - 2
    private solveQuadratic(): void {
        const a = this.terms.find(term => term.exponent === 2)?.coefficient || 0;
        const b = this.terms.find(term => term.exponent === 1)?.coefficient || 0;
        const c = this.terms.find(term => term.exponent === 0)?.coefficient || 0;

        const discriminant = b * b - 4 * a * c;
        console.log(`Discriminant: ${discriminant}`);

        if (discriminant > 0) {
            const solution1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const solution2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            console.log("Discriminant is strictly positive, the two solutions are:");
            console.log(solution1.toFixed(6));
            console.log(solution2.toFixed(6));
        } else if (discriminant === 0) {
            const solution = -b / (2 * a);
            console.log("Discriminant is zero, the solution is:");
            console.log(solution.toFixed(6));
        } else {
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            console.log("Discriminant is negative, the two complex solutions are:");
            console.log(`${realPart.toFixed(6)} + ${imaginaryPart.toFixed(6)}i`);
            console.log(`${realPart.toFixed(6)} - ${imaginaryPart.toFixed(6)}i`);
        }
    }

    // zero degree equation
    private solveZeroDegree(): void {
        const constant = this.terms.find(term => term.exponent === 0)?.coefficient || 0;

        if (constant === 0) {
            console.log("Each real number is a solution.");
        } else {
            console.log("No solution exists.");
        }
    }
}