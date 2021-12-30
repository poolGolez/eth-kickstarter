pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public campaigns;

    function createCampaign(address _manager, uint _minContribution) public {
        address campaign = new Campaign(_manager, _minContribution);
        campaigns.push(campaign);
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
    mapping(address=>bool) public contributors;
    Budget[] public budgets;
    uint contributorsCount;

    constructor(address _manager, uint _minContribution) public {
        manager = _manager;
        minContribution = _minContribution;
    }

    function contribute() public payable {
        require(msg.value  > minContribution);

        contributors[msg.sender] = true;
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
        budget.approvals[msg.sender] = true;
        budget.approvalsCount++;
    }

    function releaseBudget(uint budgetIndex) public managerOnly {
        Budget storage budget = budgets[budgetIndex];
        require(budget.approvalsCount > (contributorsCount / 2));
        require(!budget.completed);

        budget.recipient.transfer(budget.amount);
        budget.completed = true;
    }

    function funds() public view returns(uint) {
        return address(this).balance;
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