const data = await Bun.file('./challenges/2024/17/data.txt').text();

const readData =
    /Register A: (?<registerA>\d+)\nRegister B: (?<registerB>\d+)\nRegister C: (?<registerC>\d+)\n\nProgram: (?<program>(?:\d,)+\d)/.exec(
        data,
    )!.groups!;

const initialRegisterValues = {
    a: BigInt(readData.registerA),
    b: BigInt(readData.registerB),
    c: BigInt(readData.registerC),
};

const program = readData.program.split(',').map(BigInt);

/**
 * Runs the program with with the given register values and returns the joined output.
 * @param registerValues The register values to use.
 * @param registerValues.a The value of register A.
 * @param registerValues.b The value of register B.
 * @param registerValues.c The value of register C.
 */
function run(registerValues: { a: bigint; b: bigint; c: bigint }) {
    /**
     *
     * Gets the result of a combo operand.
     * @param operand The operand to handle.
     */
    function getComboOperand(operand: bigint) {
        switch (operand) {
            case 0n:
            case 1n:
            case 2n:
            case 3n: {
                return operand;
            }
            case 4n: {
                return registerValues.a;
            }
            case 5n: {
                return registerValues.b;
            }
            case 6n: {
                return registerValues.c;
            }
            default: {
                throw new Error(`Invalid operand passed: ${operand}`);
            }
        }
    }

    const output: bigint[] = [];

    /**
     * Performs an operation based on the opcode and operand.
     * @param opcode The opcode to handle.
     * @param operand The operand to handle.
     */
    function performOperation(opcode: bigint, operand: bigint) {
        const comboOperand = getComboOperand(operand);

        switch (opcode) {
            case 0n: {
                registerValues.a = registerValues.a / 2n ** comboOperand;

                break;
            }
            case 1n: {
                registerValues.b ^= operand;

                break;
            }
            case 2n: {
                registerValues.b = comboOperand & 7n;

                break;
            }
            case 3n: {
                if (registerValues.a !== 0n) instructionPointer = operand - 2n;

                break;
            }
            case 4n: {
                registerValues.b ^= registerValues.c;

                break;
            }
            case 5n: {
                output.push(comboOperand & 7n);

                break;
            }
            case 6n: {
                registerValues.b = registerValues.a / 2n ** comboOperand;

                break;
            }
            case 7n: {
                registerValues.c = registerValues.a / 2n ** comboOperand;

                break;
            }
        }
    }

    let instructionPointer = 0n;

    while (true) {
        if (instructionPointer + 1n >= program.length) break;

        performOperation(
            program[Number.parseInt(instructionPointer.toString())],
            program[Number.parseInt((instructionPointer + 1n).toString())],
        );

        instructionPointer += 2n;
    }

    return output.join(',');
}

// Part One
export const partOneResult = run(initialRegisterValues);

// Part Two

/**
 * Finds the initial register A value that will output the given program.
 * @param nextValue The next value to try.
 * @param index The index to start from.
 */
function findInitialA(nextValue = 0n, index = program.length - 1): bigint {
    if (index < 0) return nextValue;

    for (let aValue = nextValue << 3n; aValue < (nextValue << 3n) + 8n; aValue++) {
        const out = run({ a: aValue, b: 0n, c: 0n });

        if (BigInt(out.split(',')[0]) === program[index]) {
            const finalValue = findInitialA(aValue, index - 1);
            if (finalValue >= 0) return finalValue;
        }
    }

    return -1n;
}

export default findInitialA();
