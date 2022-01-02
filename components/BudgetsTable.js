const { Component } = require("react");
import { Button, Icon, Label, Menu, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
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
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    { this.props.budgets.map((budget, index) =>
                        (<BudgetsTableRow index={ index + 1 } budget={ budget } />)) }
                </Table.Body>
            </Table>
        );
    }

}

export default BudgetsTable