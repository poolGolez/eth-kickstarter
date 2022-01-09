import { Component } from "react";
import { Button, Card, Grid } from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link } from '../../routes';

class CampaignsShow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contribution: props.minimumContribution
        };
    }

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;
        const campaignContract = Campaign(campaignAddress);
        const summary = await campaignContract.methods
                            .getSummary()
                            .call();
        return {
            campaignAddress,
            minimumContribution: web3.utils.fromWei(summary[0], 'ether'),
            balance: summary[1],
            budgetsCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4]
        };
    }

    renderCampaignSummary() {
        const {
            manager,
            minimumContribution,
            balance,
            budgetsCount,
            contributorsCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Manager address',
                description: 'The manager creates the campaign and can create requests to withdraw the money.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: `${minimumContribution} ether`,
                meta: 'Minimum Contribution',
                description: 'You must contribute at least this much wei to become an approver.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: budgetsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Request must be approved by approvers.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: contributorsCount,
                meta: 'Number of contributors',
                description: 'Number of people who have already donated to this campaign.',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether') + ' ether',
                meta: 'Campaign Balance',
                description: 'The balance is how much money this campaign has left to spend.',
                style: { overflowWrap: 'break-word' }
            }
        ];
        return <Card.Group
            items={items}
            itemsPerRow="2"/>;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCampaignSummary()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <ContributeForm
                                address={ this.props.campaignAddress }
                                minimumContribution={ this.props.minimumContribution }/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <Button
                                    primary
                                    content="View Requests" />
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Layout>
        );
    }
}

export default CampaignsShow;