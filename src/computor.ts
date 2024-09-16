import { PolynomialSolver } from './polynomialSolver';
import * as readline from 'readline';

// readline interface for command-line input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = () => {
    try {
        if (process.argv.length !== 3)
            return console.error(`Usage: node path/to/computor.js "polynomial equation"\nPlease enter a polynomial equation (e.g., "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0")`)
        
        const args = process.argv.slice(2);
        const input = args.join(" ");
        const solver = new PolynomialSolver(input.toUpperCase());
        solver.solveEquation();
    }
    catch (error: any) {
        console.error(`Error: ${error.message}`);
    }
    finally {
        rl.close();
    }
};

main();
