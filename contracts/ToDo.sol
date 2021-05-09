pragma solidity >=0.4.22 <0.9.0;

contract ToDos {
    struct ToDo {
        uint256 id;
        uint256 author_id;
        string task;
        uint256 date;
        bool complete;
    }

    ToDo[] public todos;
    uint256 public nextId = 1;

    function writeToDo(string memory task, uint256 date) public {
        todos.push(ToDo(nextId, 1, task, date, false));
        nextId++;
    }

    function findToDo(uint256 id, uint256 author_id)
        internal
        view
        returns (uint256)
    {
        for (uint256 i = 0; i < todos.length; i++) {
            if (todos[i].id == id && todos[i].author_id == author_id) {
                return i;
            }
        }
        revert("ToDo not found!");
    }

    function getToDo(uint256 id, uint256 author_id)
        public
        view
        returns (
            string memory,
            uint256,
            bool
        )
    {
        uint256 i = findToDo(id, author_id);
        return (todos[i].task, todos[i].date, todos[i].complete);
    }

    function changeStatus(uint256 id, uint256 author_id) public {
        uint256 i = findToDo(id, author_id);
        if (todos[i].complete == false) {
            todos[i].complete = true;
        } else {
            todos[i].complete = false;
        }
    }
}
