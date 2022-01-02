const { Component } = require("react");
import { Button, Icon, Label, Menu, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";

class BudgetsTable extends Component {
    render() {
        const requestRow = (this.props.budgets).map((budget, index) => {
            return (
                <Table.Row key={ index }>
                    <Table.Cell>
                        <Label ribbon>{ index }</Label>
                    </Table.Cell>
                    <Table.Cell>{ budget.description }</Table.Cell>
                    <Table.Cell textAlign='right'>
                        { web3.utils.fromWei(budget.amount, 'ether') }
                    </Table.Cell>
                    <Table.Cell>{ budget.recipient }</Table.Cell>
                    <Table.Cell>
                        { budget.approvalsCount }
                    </Table.Cell>
                    <Table.Cell>
                        <Button
                            icon="thumbs up"
                            content="Approve/Finalize"
                            primary/>
                    </Table.Cell>
                </Table.Row>
            );
        })

        return (
            <Table celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>ID</Table.HeaderCell>
                            <Table.HeaderCell>Description</Table.HeaderCell>
                            <Table.HeaderCell textAlign='right'>
                                Amount (ether)
                            </Table.HeaderCell>
                            <Table.HeaderCell>Recipient</Table.HeaderCell>
                            <Table.HeaderCell>Approval Count</Table.HeaderCell>
                            <Table.HeaderCell>Action</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>

                    <Table.Body>
                        {requestRow}
                    </Table.Body>
                </Table>
        );
    }

}

export default BudgetsTable