pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public campaigns;

    function createCampaign(uint _minContribution) public {
        address campaign = new Campaign(msg.sender, _minContribution);
        campaigns.push(campaign);
    }

    function getDeployedCampaigns() public view returns(address[]) {
        return campaigns;
    }
}

contract Campaign {
    struct Budget {
        string description;
        uint amount;
        address recipient;
        bool completed;
        mapping(address => bool) approvals;
        uint approvalsCount;
    }

    address public manager;
    uint public minContribution;
    mapping(address => bool) public contributors;
    Budget[] public budgets;
    uint public contributorsCount;

    constructor(address _manager, uint _minContribution) public {
        manager = _manager;
        minContribution = _minContribution;
    }

    function contribute() public payable {
        require(msg.value  >= minContribution);

        if(!contributors[msg.sender]){
            contributors[msg.sender] = true;
            contributorsCount++;
        }
    }

    function requestBudget(string _description, uint _amount, address _recipient) public managerOnly {
        Budget memory budget = Budget({
            description: _description,
            amount: _amount,
            recipient: _recipient,
            completed: false,
            approvalsCount: 0
            });
        budgets.push(budget);
    }

    function approveBudget(uint budgetIndex) public contributorOnly {
        Budget storage budget = budgets[budgetIndex];
        require(!budget.approvals[msg.sender]);

        budget.approvalsCount++;
        budget.approvals[msg.sender] = true;
    }

    function releaseBudget(uint budgetIndex) public managerOnly {
        Budget storage budget = budgets[budgetIndex];
        require(budget.approvalsCount > (contributorsCount / 2));
        require(!budget.completed);

        budget.recipient.transfer(budget.amount);
        budget.completed = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address)  {
        return (
            minContribution,
            this.balance,
            budgets.length,
            contributorsCount,
            manager
        );
    }

    function getBudgetsCount() public view returns(uint) {
        return budgets.length;
    }

    modifier managerOnly {
        require(msg.sender == manager);
        _;
    }

    modifier contributorOnly {
        require(contributors[msg.sender]);
        _;
    }
}