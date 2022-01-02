import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const factoryAddress = '0xd388c4dFBAdeb04D2DE560CA5459d22C37a736a9';
const instance = new web3.eth.Contract(
                    JSON.parse(campaignFactory.interface),
                    factoryAddress
                );

export default instance;
