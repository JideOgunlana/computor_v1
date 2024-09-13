import { PolynomialSolver } from './computorv1';
import * as readline from 'readline';

// readline interface for command-line input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/**
 * prompts user for an input and creates a PolynomialSolver instance
*/
const promptUser = () => {
    rl.question('Please enter a polynomial equation (e.g., "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0"): ', (input) => {
        try {
            const solver = new PolynomialSolver(input.toUpperCase());
            solver.solveEquation();
        } catch (error: any) {
            console.error(`Error: ${error.message}`);
        } finally {
            rl.close();
        }
    });
};

promptUser();
