import { Button, Form, Grid, Input, Label } from "semantic-ui-react";
import NewBudgetForm from "../../../components/NewBudgetForm";
import campaign from "../../../ethereum/campaign";

const { Component } = require("react");
const { default: Layout } = require("../../../components/Layout");

class RequestsNew extends Component {

    static async getInitialProps(props) {
        const campaignAddress = props.query.address;
        return { campaignAddress }
    }

    render() {
        return (
            <Layout>
                <Grid>
                    <Grid.Column width="6">
                        <h3>Create a new request</h3>
                        <NewBudgetForm
                            campaign={this.props.campaignAddress} />
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default RequestsNew;