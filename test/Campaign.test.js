const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const compiledCampaignFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

const web3 = new Web3(ganache.provider());

let accounts;
let manager;
let contributors = [];
let recipient;
let factory;
let campaignAddress;
let campaign;
beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    [manager, contributors[0], contributors[1], recipient] = accounts;
    factory = await new web3.eth.Contract(JSON.parse(compiledCampaignFactory.interface))
                .deploy({ data: compiledCampaignFactory.bytecode })
                .send({ from: manager, gas: '1500000' });
    await factory.methods
        .createCampaign(250).send({
            from: manager,
            gas: '1500000'
        });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(JSON.parse(compiledCampaign.interface), campaignAddress);
});

describe('Campaign', () => {

    it('should initialize with correct min contribution and manager', async () => {
        assert.equal(manager, await campaign.methods.manager().call());
        assert.equal(250, await campaign.methods.minContribution().call());
        assert.equal(0, await campaign.methods.contributorsCount().call());
    });

    describe('contribute', () => {
        it('should transfer funds to the contributor', async() => {
            const contribution = 500;
            await campaign.methods
                .contribute()
                .send({
                    from: contributors[0],
                    value: contribution,
                    gas: '1000000'
                });

            assert.equal(500, await web3.eth.getBalance(campaignAddress));
            assert.equal(1, await campaign.methods.contributorsCount().call());
            assert.equal(true, await campaign.methods.contributors(contributors[0]).call());
        });

        it('should throw error if contribution is less than set minimum contribution', async() => {
            try {
                const contribution = 50;
                await campaign.methods
                    .contribute()
                    .send({
                        from: contributors[0],
                        value: contribution,
                        gas: '1000000'
                    });
            } catch(error) {
                assert(error);
            }

            assert.equal(0, await web3.eth.getBalance(campaignAddress));
            assert.equal(0, await campaign.methods.contributorsCount().call());
            assert.equal(false, await campaign.methods.contributors(contributors[0]).call());
        });
    });

    describe('requestBudget', () => {

        it('should create a budget', async() => {
            await campaign.methods
                .requestBudget('License fee', 300, recipient)
                .send({
                    from: manager,
                    gas: '1000000'
                });

            const budget = await campaign.methods.budgets(0).call();
            assert.equal('License fee', budget.description);
            assert.equal(300, budget.amount);
            assert.equal(recipient, budget.recipient);
            assert.equal(false, budget.completed);
            assert.equal(0, budget.approvalsCount);
        });

        it('should throw error if requested by a non-manager', async() => {
            try {
                await campaign.methods
                    .requestBudget('License fee', 300, recipient)
                    .send({
                        from: contributors[0],
                        gas: '1000000'
                    });
            } catch(error) {
                assert(error);
            }
        });
    });

    describe('approveBudget', () => {

        beforeEach(async() => {
            await campaign.methods
                .requestBudget('License fee', 300, recipient)
                .send({
                    from: manager,
                    gas: '1000000'
                });

            await campaign.methods
                .contribute()
                .send({
                    from: contributors[0],
                    gas: '1000000',
                    value: 500
                });
        });

        it('should mark approval by contributor', async() => {
            await campaign.methods
                .approveBudget(0)
                .send({
                    from: contributors[0],
                    gas: '1000000'
                });

            const budget = await campaign.methods.budgets(0).call();
            assert.equal(1, budget.approvalsCount);
            assert.equal(true, await campaign.methods.contributors(contributors[0]).call());
        });

        it('should throw error if made by non-contributor', async() => {
            try {
                await campaign.methods
                    .approveBudget(0)
                    .send({
                        from: recipient,
                        gas: '1000000'
                    });
            } catch (error) {
                assert(error);
            }

            const budget = await campaign.methods.budgets(0).call();
            assert.equal(0, budget.approvalsCount);
            assert.equal(false, await campaign.methods.contributors(recipient).call());
        });
    });

    describe('releaseBudget', () => {

        beforeEach(async() => {
            await campaign.methods
                .requestBudget('License fee', web3.utils.toWei('10', 'ether'), recipient)
                .send({
                    from: manager,
                    gas: '1000000'
                });

            await campaign.methods
                .contribute()
                .send({
                    from: contributors[0],
                    gas: '1000000',
                    value: web3.utils.toWei('12', 'ether')
                });


            await campaign.methods
                .contribute()
                .send({
                    from: contributors[1],
                    gas: '1000000',
                    value: web3.utils.toWei('5', 'ether')
                });
        });

        it('should transfer the budget amount to the recipient', async() => {
            const initialRecipientBalance = web3.utils.fromWei(await web3.eth.getBalance(recipient));
            await campaign.methods
                .approveBudget(0)
                .send({
                    from: contributors[0],
                    gas: '1000000'
                });

            await campaign.methods
                .approveBudget(0)
                .send({
                    from: contributors[1],
                    gas: '1000000'
                })

            await campaign.methods
                .releaseBudget(0)
                .send({
                    from: manager,
                    gas: '100000'
                });

            const budget = await campaign.methods.budgets(0).call();
            assert(budget.completed);

            const finalRecipientBalance = web3.utils.fromWei(await web3.eth.getBalance(recipient), 'ether');
            assert.equal(10, parseFloat(finalRecipientBalance) - parseFloat(initialRecipientBalance));
        });

        it('should throw error if not more than half of the contributors approved', async() => {
            await campaign.methods
                .approveBudget(0)
                .send({
                    from: contributors[0],
                    gas: '1000000'
                });

            try {
                await campaign.methods
                    .releaseBudget(0)
                    .send({
                        from: manager,
                        gas: '100000'
                    });
            } catch (error) {
                assert(error);
            }

            const budget = await campaign.methods.budgets(0).call();
            assert(!budget.completed);
        });

        it('should transfer the budget amount to the recipient', async() => {
            await campaign.methods
                .approveBudget(0)
                .send({
                    from: contributors[0],
                    gas: '1000000'
                });

            await campaign.methods
                .approveBudget(0)
                .send({
                    from: contributors[1],
                    gas: '1000000'
                })

            await campaign.methods
                .releaseBudget(0)
                .send({
                    from: manager,
                    gas: '100000'
                });

            const initialRecipientBalance = web3.utils.fromWei(await web3.eth.getBalance(recipient));
            try {
                await campaign.methods
                    .releaseBudget(0)
                    .send({
                        from: manager,
                        gas: '100000'
                    });
            } catch (error) {
                assert(error);
            }

            const budget = await campaign.methods.budgets(0).call();
            assert(budget.completed);

            const finalRecipientBalance = web3.utils.fromWei(await web3.eth.getBalance(recipient), 'ether');
            assert.equal(0, parseFloat(finalRecipientBalance) - parseFloat(initialRecipientBalance));
        });
    });
});