import { Button, Icon, Label, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";

const { Component } = require("react");

class BudgetsTableRow extends Component {

    approveCellElement(isApproved) {
        if(isApproved) {
            return (
                <span>
                    <Icon name="check circle" color="green"/>
                    <font color="green"><b>Approved</b></font>
                </span>
            );
        } else {
            return (
                <Button
                icon="thumbs up"
                content="Approve"
                onClick={ this.props.onApprove }
                primary />
            );
        }
    }

    finalizeCellElement = function (isComplete) {
        if(isComplete) {
            return (
                <span>
                    <Icon name="check circle" color="green"/>
                    <font color="green"><b>Released</b></font>
                </span>
            );
        } else {
            return (
                <Button
                    icon="check"
                    content="Finalize"
                    onClick={ this.props.onFinalize }
                    positive/>
            );
        }
    }

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
                    { this.approveCellElement(this.props.isApproved) }
                </Cell>
                <Cell>
                    { this.finalizeCellElement(this.props.budget.completed) }
                </Cell>
            </Row>
        );
    }
}

export default BudgetsTableRow;