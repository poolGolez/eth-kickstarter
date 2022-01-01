import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const factoryAddress = '0xDB2e6886676e23Ae0126A81eeE75875dAEC78148';
const instance = new web3.eth.Contract(
                    JSON.parse(campaignFactory.interface),
                    factoryAddress
                );

export default instance;
