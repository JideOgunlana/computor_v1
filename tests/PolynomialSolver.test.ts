import { PolynomialSolver } from "../src/computorv1";

// Mock console.log for capturing output
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();

describe("PolynomialSolver Tests", () => {
    afterEach(() => {
        mockConsoleLog.mockClear();  // Clear logs after each test
    });

    afterAll(() => {
        mockConsoleLog.mockRestore();  // Restore original console.log
    });

    test("Handles constant equation (degree 0) with no solution", () => {
        const solver = new PolynomialSolver("5 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form: 5 * X^0 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("No solution exists.");
    });

    test("Handles constant equation (degree 0) with infinite solutions", () => {
        const solver = new PolynomialSolver("0 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form: 0 * X^0 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Each real number is a solution.");
    });

    test("Solves linear equation (degree 1)", () => {
        const solver = new PolynomialSolver("4 * X^1 + 5 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form: 5 * X^0 + 4 * X^1 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 1");
        expect(mockConsoleLog).toHaveBeenCalledWith("The solution is: -1.25");
    });

    test("Solves quadratic equation with positive discriminant (degree 2)", () => {
        const solver = new PolynomialSolver("1 * X^2 + 0 * X^1 - 1 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form:- 1 * X^0 + 1 * X^2 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 2");
        expect(mockConsoleLog).toHaveBeenCalledWith("Discriminant: 4");
        expect(mockConsoleLog).toHaveBeenCalledWith("Discriminant is strictly positive, the two solutions are:");
        expect(mockConsoleLog).toHaveBeenCalledWith(1);
        expect(mockConsoleLog).toHaveBeenCalledWith(-1);
    });

    test("Solves quadratic equation with zero discriminant", () => {
        const solver = new PolynomialSolver("1 * X^2 + 2 * X^1 + 1 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form: 1 * X^0 + 2 * X^1 + 1 * X^2 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 2");
        expect(mockConsoleLog).toHaveBeenCalledWith("Discriminant: 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Discriminant is zero, the solution is:");
        expect(mockConsoleLog).toHaveBeenCalledWith(-1);
    });

    test("Solves quadratic equation with negative discriminant (complex solutions)", () => {
        const solver = new PolynomialSolver("1 * X^2 + 0 * X^1 + 1 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form: 1 * X^0 + 1 * X^2 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 2");
        expect(mockConsoleLog).toHaveBeenCalledWith("Discriminant: -4");
        expect(mockConsoleLog).toHaveBeenCalledWith("Discriminant is negative, the two complex solutions are:");
        expect(mockConsoleLog).toHaveBeenCalledWith("0 + 1i");
        expect(mockConsoleLog).toHaveBeenCalledWith("0 - 1i");
    });

    test("Throws error on invalid equation format", () => {
        expect(() => {
            const solver = new PolynomialSolver("4 * X^2 + 5 = 0");

        }).toThrow("Equation is not valid: All terms must be in the form 'coefficient * X^n'.");
    });

    test("Cannot solve polynomials with degree greater than 2", () => {
        const solver = new PolynomialSolver("1 * X^3 + 0 * X^2 + 1 * X^0 = 0 * X^1");
        solver.solveEquation();

        expect(mockConsoleLog).toHaveBeenCalledWith("Reduced form: 1 * X^0 + 1 * X^3 = 0");
        expect(mockConsoleLog).toHaveBeenCalledWith("Polynomial degree: 3");
        expect(mockConsoleLog).toHaveBeenCalledWith("The polynomial degree is strictly greater than 2, I can't solve.");
    });
});
