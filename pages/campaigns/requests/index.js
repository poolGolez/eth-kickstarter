import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import BudgetsTable from "../../../components/BudgetsTable";
import Campaign from "../../../ethereum/campaign";
import { Link } from '../../../routes';
import web3 from "../../../ethereum/web3";

const { Component } = require("react");

class RequestsIndex extends Component {

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;
        const campaignContract = Campaign(campaignAddress);
        const summary = await campaignContract.methods
                            .getSummary()
                            .call();

        const budgetsCount = parseInt(await campaignContract.methods
                                .getBudgetsCount()
                                .call());
        const budgets = await Promise.all(Array(budgetsCount).fill().map((_, index) => {
                            return campaignContract.methods.budgets(index).call();
                        }));
        const campaign = {
            address: campaignAddress,
            minimumContribution: summary[0],
            balance: summary[1],
            budgetsCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4],
            budgets
        };

        return { campaign };
    }

    onApprove = async(budgetId) => {
        const [sender] = await web3.eth.getAccounts();
        const campaignContract = Campaign(this.props.campaign.address);
        await campaignContract.methods
            .approveBudget(budgetId)
            .send({
                from: sender,
                gas: '1000000'
            });
        console.log(`Approved ${budgetId} by ${sender}`);
    }

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.campaign.address}/requests/new`}>
                    <Button
                        floated="right"
                        content="Request new budget"
                        primary />
                </Link>
                <h3>Requests</h3>
                <BudgetsTable
                    campaign={ this.props.campaign }
                    onApprove={ this.onApprove }/>
            </Layout>
        );
    }
}

export default RequestsIndex