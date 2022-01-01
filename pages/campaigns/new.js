import { Component } from "react";
import { Button, Form, Icon, Input, Label, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import CampaignFactory from "../../ethereum/factory";
import web3 from '../../ethereum/web3';

class CampaignsNew extends Component {
    state = {
        minContribution: '250',
        errorMessage: '',
        submitting: false
    }

    onSubmit = async (event) => {
        this.setState({ submitting: true, errorMessage: '' });
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
        this.setState({ submitting: false });
    };

    render() {
        return (
            <Layout>
                <h3>Create a new campaign</h3>
                <Form
                    loading={ this.state.submitting }
                    onSubmit={ this.onSubmit }
                    error={this.state.errorMessage}>
                    <Form.Field>
                        <label>Minimum Contribution</label>
                        <Input
                            label={{basic: true, content: 'wei'}}
                            labelPosition='right'
                            onChange={ event => this.setState({minContribution: event.target.value}) }
                            value={this.state.minContribution}/>
                    </Form.Field>

                    <Message
                        error
                        header='Something went wrong'
                        content={this.state.errorMessage}
                    />
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