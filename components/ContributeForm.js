const { Component } = require("react");
import { Router } from "../routes";
import { Button, Form, Input } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

class ContributeForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contribution: props.minimumContribution
        };
    }

    onSubmit = async(event) => {
        event.preventDefault();

        const campaignContract = Campaign(this.props.address);
        const [ accountAddress ] = await web3.eth.getAccounts();
        await campaignContract.methods
            .contribute()
            .send({
                from: accountAddress,
                value: this.state.contribution,
                gas: '1000000'
            });
        Router.replaceRoute(`/campaigns/${this.props.address}`)
    };

    render() {
        return (
            <div>
                <h3>Contribute to this campaign!</h3>
                <Form onSubmit={ this.onSubmit }>
                    <Form.Field>
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
                    </Form.Field>
                </Form>
            </div>
        );
    }
}

export default ContributeForm;