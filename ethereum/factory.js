import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';
const factoryAddress = '0xf19cE343344B3Ab433b3148dC727A3C2347783a0';

const instance = new web3.eth.Contract(
                    JSON.parse(campaignFactory.interface),
                    factoryAddress
                );

export default instance;
