const data = await Bun.file('./challenges/2024/9/data.txt').text();

// Part One
const partOneFiles: (number | null)[] = [];

for (const [index, size] of [...data].entries())
    partOneFiles.push(...Array.from({ length: Number.parseInt(size) }).map(() => (index % 2 === 0 ? index / 2 : null)));

for (const [fileIndex, file] of partOneFiles.entries()) {
    if (file !== null) continue;

    const lastFileIndex = partOneFiles.findLastIndex((file) => file !== null);

    if (lastFileIndex < fileIndex) break;

    const lastFile = partOneFiles[lastFileIndex];

    partOneFiles[fileIndex] = lastFile;
    partOneFiles[lastFileIndex] = file;
}

const partOneChecksum = partOneFiles.reduce((previous, current, index) => previous! + (current ?? 0) * index, 0);

export { partOneChecksum };

// Part Two
const partTwoFiles: { id: number | null; size: number }[] = [];

for (const [index, size] of [...data].entries()) partTwoFiles.push({ id: index % 2 === 0 ? index / 2 : null, size: Number.parseInt(size) });

for (const [fileIndex, file] of partTwoFiles.entries()) {
    if (file.id !== null) continue;

    const lastFileIndex = partTwoFiles.findLastIndex((compareFile) => compareFile.id !== null && compareFile.size <= file.size);

    if (lastFileIndex < fileIndex) continue;

    const lastFile = partTwoFiles[lastFileIndex];

    partTwoFiles[fileIndex] = lastFile;
    partTwoFiles[lastFileIndex] = { id: null, size: lastFile.size };

    if (file.size !== lastFile.size) partTwoFiles.splice(fileIndex + 1, 0, { id: null, size: file.size - lastFile.size });
}

const finalOutput: (number | null)[] = [];

for (const file of partTwoFiles) finalOutput.push(...Array.from({ length: file.size }).map(() => file.id ?? null));

const partTwoChecksum = finalOutput.reduce((previous, current, index) => previous! + (current ?? 0) * index, 0);

export default partTwoChecksum;
