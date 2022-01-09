import { Button, Icon, Label, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";

const { Component } = require("react");

class BudgetsTableRow extends Component {
    render() {
        const { Row, Cell } = Table;
        console.log(this.props.isApproved);

        const approvedButton = (
            <Button
            icon="thumbs up"
            content="Approve"
            onClick={ this.props.onApprove }
            primary />
        );

        const approvedSeal = (
            <span>
                <Icon name="check circle" color="green"/>
                <font color="green"><b>Approved</b></font>
            </span>
        );

        return (
            <Row key={ this.props.index }>
                <Cell>
                    <Label ribbon>{ this.props.index }</Label>
                </Cell>
                <Cell>{ this.props.budget.description }</Cell>
                <Cell textAlign="right">
                    { web3.utils.fromWei( this.props.budget.amount, 'ether') }
                </Cell>
                <Cell>
                    { this.props.budget.recipient }
                    </Cell>
                <Cell textAlign="right">
                    { this.props.budget.approvalsCount } / { this.props.contributorsCount }
                </Cell>
                <Cell>
                    { this.props.isApproved ? approvedSeal : approvedButton }
                </Cell>
                <Cell>
                    <Button
                        icon="check"
                        content="Finalize"
                        onClick={ this.props.onFinalize }
                        positive/>
                </Cell>
            </Row>
        );
    }
}

export default BudgetsTableRow;