const ToDoList = artifacts.require('ToDoList');

contract('ToDoList', () => {
    it('deploys Contract', async () => {
        const toDoList = await ToDoList.deployed();
        console.log(toDoList.address);
        assert(toDoList.address !== '');
    });
})