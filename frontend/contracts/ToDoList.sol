// SPDX-License-Identifier: RANDOM_TEXT
pragma solidity ^0.8.5;

contract ToDoList {

    struct ToDo {
        uint id;
        string task;
        bool status;
    }
    
    uint nextId;
    mapping(address => mapping(uint => ToDo)) public todos;
    mapping(address => uint) public amount;
    mapping(address => uint[]) public ids;
    mapping(address => string[]) public tasks;
    mapping(address => bool[]) public bools;

    
    function createToDo(string calldata task) external {
        todos[msg.sender][nextId] = ToDo(nextId, task, false);
        ids[msg.sender].push(nextId);
        tasks[msg.sender].push(task);
        bools[msg.sender].push(false);
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
        uint[] memory array_of_ids = ids[msg.sender];
        for (uint i = 0; i < array_of_ids.length; i++) {
            if (ids[msg.sender][i] == id) {
                if (bools[msg.sender][i] == true) {
                    bools[msg.sender][i] = false;
                } else {
                    bools[msg.sender][i] = true;
                }
                return;
            }
        }
    }
    
    function deposit() payable public {
        require(amount[msg.sender] == 0, 'can only deposit once');
        amount[msg.sender] += msg.value;
    }
    
    function withdraw() public {
        require(amount[msg.sender] > 0, 'can withdraw if you have a balance');
        uint[] memory array_of_ids = ids[msg.sender];
        bool validate = true;
        for (uint i = 0; i < array_of_ids.length; i++) {
            if (todos[msg.sender][ids[msg.sender][i]].status == false) {
                validate = false;
            }
        }
        require(validate == true, 'You still have incomplete tasks');
        payable(msg.sender).transfer(amount[msg.sender]);
        amount[msg.sender] = 0;
        return;
    }
    
    function getTodos() public view returns(uint[] memory, string[] memory, bool[] memory) {
        return (ids[msg.sender], tasks[msg.sender], bools[msg.sender]);
    }
    
   function getBalance() view public returns(uint) {
        return address(this).balance;
    }
}