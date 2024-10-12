# Computor v1

## Description

**Computor v1** is a command-line program written in **TypeScript** that solves polynomial equations of degree **2 or lower**. It takes a polynomial equation as an input string, reduces it to its canonical form, determines the degree, and outputs the solution(s) along with useful context such as the discriminant.

---

## Features

- Parses and reduces polynomial equations in the format: `a * X^b`
- Supports terms with powers up to 2
- Displays:
  - Reduced form of the equation
  - Polynomial degree
  - Discriminant (if applicable)
  - Solution(s), depending on the discriminant and degree

For unsupported degrees (greater than 2), it exits gracefully with a message.

---

## Dependencies

Make sure you have **Node.js** and **TypeScript** installed:

```bash
npm install -g typescript
npm install
```
#### Build the TypeScript code
```
tsc
```

## Usage

```bash
node build/computor.js "your_equation_here"
```


### Examples
```bash
$> node build/computor.js "5 * X^0 + 4 * X^1 - 9.3 * X^2 = 1 * X^0"
Reduced form: 4 * X^0 + 4 * X^1 - 9.3 * X^2 = 0
Polynomial degree: 2
Discriminant is strictly positive, the two solutions are:
0.905239
-0.475131

$> node build/computor.js "8 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 3 * X^0"
Reduced form: 5 * X^0 - 6 * X^1 + 0 * X^2 - 5.6 * X^3 = 0
Polynomial degree: 3
The polynomial degree is strictly greater than 2, I can't solve.
```