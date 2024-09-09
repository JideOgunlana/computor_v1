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
    solveLinear(): void {
        const a = this.terms.find((term) => term.exponent === 1)?.coefficient || 0;
        const b = this.terms.find((term) => term.exponent === 0)?.coefficient || 0;

        if (a === 0) {
            if (b === 0) {
                console.log("Each real number is a solution.");
            } else {
                console.log("No solution exists.");
            }
        } else {
            const solution = -b / a;
            console.log(`The solution is: ${solution}`);
        }
    }

    // degree - 2
    solveQuadratic(): void {
        const a = this.terms.find((term) => term.exponent === 2)?.coefficient || 0;
        const b = this.terms.find((term) => term.exponent === 1)?.coefficient || 0;
        const c = this.terms.find((term) => term.exponent === 0)?.coefficient || 0;

        const discriminant = b * b - 4 * a * c;
        console.log(`Discriminant: ${discriminant}`);

        if (discriminant > 0) {
            const solution1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const solution2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            console.log("Discriminant is strictly positive, the two solutions are:");
            console.log(solution1);
            console.log(solution2);
        } else if (discriminant === 0) {
            const solution = -b / (2 * a);
            console.log("Discriminant is zero, the solution is:");
            console.log(solution);
        } else {
            const realPart = -b / (2 * a);
            const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
            console.log("Discriminant is negative, the two complex solutions are:");
            console.log(`${realPart} + ${imaginaryPart}i`);
            console.log(`${realPart} - ${imaginaryPart}i`);
        }
    }

    // zero degree equation
    solveZeroDegree(): void {
        const constant = this.terms.find((term) => term.exponent === 0)?.coefficient || 0;

        if (constant === 0) {
            console.log("Each real number is a solution.");
        } else {
            console.log("No solution exists.");
        }
    }
}