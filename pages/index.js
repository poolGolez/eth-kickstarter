import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Button, Icon, Card } from 'semantic-ui-react';
import Layout from '../components/Layout';

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns }
    }

    renderCampaigns() {
        const items = this.props.campaigns.map((address) => {
            return {
                header: address,
                description: <a>View Campaign</a>,
                fluid: true
            };
        })
        return <Card.Group items={items} />;
    }

    render () {
        return (
            <Layout>
                <h3>Open Campaigns</h3>
                <Button
                    icon
                    primary
                    floated='right'
                    labelPosition='left'>
                    <Icon name='add'/>Create Campaign
                </Button>
                { this.renderCampaigns() }
            </Layout>
        );
    }
}

export default CampaignIndex;
