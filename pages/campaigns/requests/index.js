import { Button } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import BudgetsTable from "../../../components/BudgetsTable";
import Campaign from "../../../ethereum/campaign";
import { Link } from '../../../routes';
import web3 from "../../../ethereum/web3";

const { Component } = require("react");

class RequestsIndex extends Component {

    state = {
        loaded: false,
        sender: '',
        campaign: {
            minimumContribution: '',
            balance: '',
            budgetsCount: 0,
            contributorsCount: 0,
            manager: '',
            budgets: [],
            approvals: []
        }
    };

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;
        return { campaignAddress };
    }

    async componentDidMount() {
        const campaignContract = Campaign(this.props.campaignAddress);
        const summary = await campaignContract.methods
                            .getSummary()
                            .call();
        console.log("Summary:", summary);

        const minimumContribution = summary[0];
        const balance = summary[1];
        const budgetsCount = parseInt(summary[2]);
        const contributorsCount = parseInt(summary[3]);
        const manager = summary[4];
        const budgets = await Promise.all(Array(parseInt(budgetsCount)).fill().map((_, index) => {
                                        return campaignContract.methods.budgets(index).call();
                                    }));


        const [sender] = await web3.eth.getAccounts();
        const approvals = [];
        if(sender != manager) {
            approvals = await campaignContract.methods
                                .getSelfApprovals()
                                .call({ from: sender });
        }

        this.setState({
            sender,
            campaign: { minimumContribution, balance, budgetsCount, contributorsCount, manager, budgets, approvals },
            loaded: true
        });
        console.log(this.state.campaign);
    }

    onApprove = async(budgetId) => {
        const campaignContract = Campaign(this.props.campaignAddress);
        await campaignContract.methods
            .approveBudget(budgetId)
            .send({
                from: this.state.sender,
                gas: '1000000'
            });
        console.log(`Approved ${budgetId} by ${this.state.sender}`);
    }

    render() {
        const loadingChild = (<span>Loading</span>);

        const budgetsTable = (
                <div>
                    <Link route={`/campaigns/${this.props.campaignAddress}/requests/new`}>
                        <Button
                            floated="right"
                            content="Request new budget"
                            primary />
                    </Link>
                    <h3>Requests</h3>
                        <BudgetsTable
                            campaign={ this.state.campaign }
                            onApprove={ this.onApprove }/>
                </div>
            );

        const layout = (this.state.loaded ? budgetsTable : loadingChild);
        return (<Layout>{ layout }</Layout> );
    }
}

export default RequestsIndex