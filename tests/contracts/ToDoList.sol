pragma solidity ^0.5.2;
pragma experimental ABIEncoderV2;

contract ToDoList {

    struct ToDo {
        uint id;
        string task;
        bool status;
    }
    
    uint nextId;
    bool[] public array_of_bools;
    mapping(address => mapping(uint => ToDo)) public todos;
    mapping(address => uint) public amount;
    mapping(address => uint[]) public ids;
    mapping(address => string[]) public tasks;

    
    function createToDo(string calldata task) external {
        todos[msg.sender][nextId] = ToDo(nextId, task, false);
        ids[msg.sender].push(nextId);
        tasks[msg.sender].push(task);
        nextId++;
    }
    
    function updateToDo(uint id) external {
        require(id <= nextId, 'This todo does not exist');
        bool current_status = todos[msg.sender][id].status;
        if (current_status == false) {
            todos[msg.sender][id].status = true;
        } else {
            todos[msg.sender][id].status = false;
        }
    }
    
    function deposit() payable public {
        require(amount[msg.sender] == 0, 'can only deposit once');
        amount[msg.sender] += msg.value;
    }
    
    function withdraw() payable public {
        require(amount[msg.sender] > 0, 'can withdraw if you have a balance');
        uint[] memory array_of_ids = ids[msg.sender];
        bool validate = true;
        for (uint i = 0; i < array_of_ids.length; i++) {
            if (todos[msg.sender][ids[msg.sender][i]].status == false) {
                validate = false;
            }
        }
        require(validate == true, 'You still have incomplete tasks');
        address payable receiver = msg.sender;
        receiver.transfer(amount[msg.sender]);
        amount[msg.sender] = 0;
        return;
    }
    
    function getTodos() external returns(uint[] memory, string[] memory, bool[] memory) {
        uint[] memory array_of_ids = ids[msg.sender];
        for (uint i = 0; i < array_of_ids.length; i++) {
            array_of_bools.push(todos[msg.sender][ids[msg.sender][i]].status);
        }
        bool[] memory new_array_of_bools = array_of_bools;
        delete array_of_bools;
        return (ids[msg.sender], tasks[msg.sender], new_array_of_bools);
    }
    
   function getBalance() view public returns(uint) {
        return address(this).balance;
    }
}