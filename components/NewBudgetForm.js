import { Button, Form, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
const { Component } = require("react");

class NewBudgetForm extends Component {
    state = {
        description: '',
        amount: '',
        recipient: '',
        successMessage: { header: '', content: ''},
        errorMessage: { header: '', content: ''},
        submitting: false
    };

    onSubmit = async(event) => {
        this.setState({
            successMessage: { header: '', content: ''},
            errorMessage: { header: '', content: ''},
            submitting: true
        });
        event.preventDefault();
        console.log("State:", this.state);

        const [sender] = await web3.eth.getAccounts();
        console.log("Accounts:", sender);
        const campaign = Campaign(this.props.campaign);

        const amountWei = web3.utils.toWei(this.state.amount, 'ether');
        try {
            await campaign.methods
                .requestBudget(this.state.description, amountWei, this.state.recipient)
                .send({
                    from: sender,
                    gas: '1000000'
                });

            this.setState({
                description: '',
                amount: '',
                recipient: '',
                successMessage: {
                    header: 'Transaction successful',
                    content: 'Successfully requested new budget.'
                },
                submitting: false
            });
        } catch (err) {
            this.setState({
                errorMessage: {
                    header: 'Something went wrong with the transaction',
                    content: err.message
                },
                submitting: false
            });
        }
    };

    render() {
        return(
            <Form onSubmit={this.onSubmit} loading={ this.state.submitting }>
                <Message positive hidden={ !this.state.successMessage.content }>
                    <Message.Header>{ this.state.successMessage.header }</Message.Header>
                    <p>{ this.state.successMessage.content }</p>
                </Message>
                <Message negative hidden={ !this.state.errorMessage.content }>
                    <Message.Header>{ this.state.errorMessage.header }</Message.Header>
                    <p>{ this.state.errorMessage.content }</p>
                </Message>
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