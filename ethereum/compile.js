const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

const buildDir = 'build';
const buildPath = path.resolve(__dirname, buildDir);
console.debug(`Build path ${buildPath}`);

console.debug("Removing build directory...");
fs.removeSync(buildPath);

const srcPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(srcPath, 'utf-8');
const compiledSource = solc.compile(source);

console.debug("Creating build directory...");
fs.ensureDirSync(buildPath);

const contracts = compiledSource.contracts;
for(let contractKey in contracts) {
    const contractName = contractKey.replace(':', '');
    fs.outputJSONSync(
        path.resolve(buildPath, `${contractName}.json`),
        contracts[contractKey]
    );
}

console.log("Successfully compiled");