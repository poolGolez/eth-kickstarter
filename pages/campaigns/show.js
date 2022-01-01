import { Component } from "react";
import { Button, Card, Form, Grid, GridColumn, Icon, Input } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";

class CampaignsShow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contribution: props.minimumContribution
        };
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        const campaignContract = Campaign(address);
        const summary = await campaignContract.methods
                            .getSummary()
                            .call();
        return {
            address,
            minimumContribution: summary[0],
            balance: summary[1],
            budgetsCount: summary[2],
            contributorsCount: summary[3],
            manager: summary[4]
        };
    }

    onSubmit = async(event) => {
        event.preventDefault();

        const campaignContract = Campaign(this.props.address);
        const [ account ] = await web3.eth.getAccounts();
        await campaignContract.methods
            .contribute()
            .send({
                from: account,
                value: this.state.contribution,
                gas: '1000000'
            });
    };

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
                header: `${minimumContribution} wei`,
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

    renderContributeForm() {
        return (
            <div>
                <h3>Contribute to this campaign!</h3>
                <Form onSubmit={ this.onSubmit }>
                    <Input
                        label={{basic: true, content: 'wei'}}
                        labelPosition='right'
                        onChange={ event => this.setState({contribution: event.target.value}) }
                        value={this.state.contribution} />
                    <Button
                        type='submit'
                        icon='money'
                        content='Contribute'
                        style={{ marginTop: '16px' }}
                        primary/>
                </Form>
            </div>
        );
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>

                <Grid celled>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCampaignSummary()}
                        </Grid.Column>
                        <Grid.Column width={6}>
                            { this.renderContributeForm() }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>

            </Layout>
        );
    }
}

export default CampaignsShow;