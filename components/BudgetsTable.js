const { Component } = require("react");
import { Table } from "semantic-ui-react";
import campaign from "../ethereum/campaign";
import BudgetsTableRow from "./BudgetsTableRow";

class BudgetsTable extends Component {

    render() {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Description</Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">
                            Amount (ether)
                        </Table.HeaderCell>
                        <Table.HeaderCell>Recipient</Table.HeaderCell>
                        <Table.HeaderCell textAlign="right">Approval Count</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Approve</Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">Finalize</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    { this.props.campaign.budgets.map((budget, index) =>
                        (<BudgetsTableRow
                            key={ index + 1 }
                            index={ index + 1 }
                            contributorsCount={ this.props.campaign.contributorsCount }
                            budget={ budget } />)) }
                </Table.Body>
            </Table>
        );
    }
}

export default BudgetsTable