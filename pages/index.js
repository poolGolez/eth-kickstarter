import React, { Component } from 'react';
import factory from '../ethereum/factory';
import { Button, Icon, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

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
        return <div>
            <h3>Open Campaigns</h3>
            { this.renderCampaigns() }
            <Button icon primary labelPosition='left'>
                <Icon name='add'/> Create Campaign
            </Button>
        </div>
    }
}

export default CampaignIndex;
