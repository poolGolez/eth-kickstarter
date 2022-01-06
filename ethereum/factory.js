import web3 from './web3';
import campaignFactory from './build/CampaignFactory.json';

const factoryAddress = '0xb0976d8396D446f3D3336D280A34B062089Ecd92';
const instance = new web3.eth.Contract(
                    JSON.parse(campaignFactory.interface),
                    factoryAddress
                );

export default instance;
