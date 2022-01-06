import { Button, Label, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";

const { Component } = require("react");

class BudgetsTableRow extends Component {
    render() {
        const { Row, Cell } = Table;
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
                    <Button
                        icon="thumbs up"
                        content="Approve"
                        onClick={ this.props.onApprove }
                        primary />
                </Cell>
                <Cell>
                    <Button icon="check" content="Finalize"positive />
                </Cell>
            </Row>
        );
    }
}

export default BudgetsTableRow;