const fs = require('fs-extra');
const path = require('path');
const Web3 = require('web3');
const HdWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const provider = new HdWalletProvider(process.env.METAMASK_MNEMONIC, process.env.NETWORK_URL);
const web3 = new Web3(provider);

const deploy = async() => {
    try {
        const [manager] = await web3.eth.getAccounts();
        console.log("Manager account: " + manager);
        console.log("Balance: " + await web3.eth.getBalance(manager));

        const contractInterface = JSON.parse(compiledCampaignFactory.interface);
        console.debug("Deploying contract...");
        const contract = await new web3.eth.Contract(contractInterface)
                                    .deploy({ data: compiledCampaignFactory.bytecode })
                                    .send({ from: manager, gas: '1500000' });
        const contractAddress = contract.options.address;

        console.debug("Saving contract artifacts...");
        writeArtifacts('Campaign', contractAddress, contractInterface);

        console.log("Deployed contract at: " + contractAddress);
    } catch(err) {console.log(err);
    } finally {
        provider.engine.stop();
    }
};
deploy();

const writeArtifacts = (name, address, interface) => {
    const deployDir = path.resolve(__dirname, 'out');
    fs.removeSync(deployDir);

    const output = {
        address: address,
        interface: interface
    };
    fs.ensureDirSync(deployDir);

    const outputPath = path.resolve(deployDir, `${name}.json`);
    fs.outputJSONSync(outputPath, output);

    console.log("Artifacts at:", outputPath);
};