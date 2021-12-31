import { Component } from "react";
import { Button, Form, Icon, Input, Label } from "semantic-ui-react";
import Layout from "../../components/Layout";
import CampaignFactory from "../../ethereum/factory";
import web3 from '../../ethereum/web3';

class CampaignsNew extends Component {
    state = {
        minContribution: '250',
        errorMessage: ''
    }

    onSubmit = async (event) => {
        event.preventDefault();

        try {
            const accounts = await web3.eth.getAccounts();
            await CampaignFactory.methods
                .createCampaign(this.state.minContribution)
                .send({
                    from: accounts[0],
                    gas: '1000000'
                });
        } catch(err) {
            this.setState({ errorMessage: err.message });
        }

    };

    render() {
        return (
            <Layout>
                <h3>Create a new campaign</h3>
                <Form onSubmit={ this.onSubmit }>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label={{basic: true, content: 'wei'}}
                            labelPosition='right'
                            onChange={ event => this.setState({minContribution: event.target.value}) }
                            value={this.state.minContribution}/>
                    </Form.Field>
                    <Button
                        type='submit'
                        icon
                        primary>
                        <Icon name='save'/> Create
                    </Button>
                </Form>
            </Layout>
        );
    }
};

export default CampaignsNew;