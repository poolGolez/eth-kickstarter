import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import BudgetsTable from "../../../components/BudgetsTable";
import Campaign from "../../../ethereum/campaign";
import { Link } from '../../../routes';

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
            addresss: campaignAddress,
            minimumContribution: summary[0],
            balance: summary[1],
            budgetsCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4],
            budgets
        }

        return { campaign };
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
                <BudgetsTable budgets={ this.props.campaign.budgets }></BudgetsTable>
            </Layout>
        );
    }
}

export default RequestsIndex