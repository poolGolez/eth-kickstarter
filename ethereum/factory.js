import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const factoryAddress = '0x363Fc55474Fc686Bd61175bd623A8047aCDaca08';
const instance = new web3.eth.Contract(
                    JSON.parse(campaignFactory.interface),
                    factoryAddress
                );

export default instance;
