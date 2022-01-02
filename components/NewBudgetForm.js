import { Button, Form, Input } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import SuccessMessage from "./SuccessMessage";

const { Component } = require("react");

class NewBudgetForm extends Component {
    state = {
        description: '',
        amount: '',
        recipient: '',
        message: { header: '', content: ''},
        submitting: false
    };

    onSubmit = async(event) => {
        this.setState({ submitting: true });
        event.preventDefault();
        console.log("State:", this.state);


        const [sender] = await web3.eth.getAccounts();
        console.log("Accounts:", sender);
        const campaign = Campaign(this.props.campaign);
        await campaign.methods
            .requestBudget(this.state.description, this.state.amount, this.state.recipient)
            .send({
                from: sender,
                gas: '1000000'
            });

        this.setState({
            description: '',
            amount: '',
            recipient: '',
            message: {
                header: 'Transaction successful',
                content: 'Successfully requested new budget'
            },
            submitting: false
        });
    };

    render() {
        return(
            <Form onSubmit={this.onSubmit} loading={ this.state.submitting }>
                <SuccessMessage message={ this.state.message }/>
                <Form.Input
                    label="Description"
                    input="text"
                    value={ this.state.description }
                    onChange={ (e) => { this.setState({ description: e.target.value }); } }/>
                <Form.Field>
                    <label>Amount</label>
                    <Input
                        type="number"
                        label={{ basic: true, content: 'ether' }}
                        labelPosition='right'
                        value={ this.state.amount }
                        onChange={ (e) => { this.setState({ amount: e.target.value }); } }/>
                </Form.Field>
                <Form.Input
                    label="Recipient"
                    input="text"
                    value={ this.state.recipient }
                    onChange={ (e) => { this.setState({ recipient: e.target.value }); } }/>

                <Button
                    type='submit'
                    content='Create request'
                    loading={this.state.submitting}
                    primary/>
            </Form>
        );
    }
}

export default NewBudgetForm;