const { Component } = require("react");
import { Table } from "semantic-ui-react";
import BudgetsTableRow from "./BudgetsTableRow";

class BudgetsTable extends Component {

    render() {
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
                        <Table.HeaderCell>Approve</Table.HeaderCell>
                        <Table.HeaderCell>Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    { this.props.campaign.budgets.map((budget, index) =>
                        (<BudgetsTableRow
                            key={ index + 1 }
                            index={ index + 1 }
                            budget={ budget } />)) }
                </Table.Body>
            </Table>
        );
    }
}

export default BudgetsTable