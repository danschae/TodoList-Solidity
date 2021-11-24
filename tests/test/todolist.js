const ToDoList = artifacts.require('ToDoList');
const {expectRevert} = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');

contract('ToDoList', (accounts) => {
    let toDoList = null;
    let account1 = accounts[0];
    let account2 = accounts[1];
    // initial test just to make sure it's deployed
    // it('deploys Contract', async () => {
    //     const toDoList = await ToDoList.deployed();
    //     console.log(toDoList.address);
    //     assert(toDoList.address !== '');
    // });
    before(async () => {
        toDoList = await ToDoList.deployed();
    })

    it('can create todo list', async () => {
        await toDoList.createToDo('to test dApp', {from: account1});
        await toDoList.createToDo('to test dApp again', {from: account2});
        const firstToDo = await toDoList.todos(account1, 0);
        const secondToDo = await toDoList.todos(account2, 1)
        assert(firstToDo.task === 'to test dApp');
        assert(secondToDo.task === 'to test dApp again');
    });

    it('can deposit money', async () => {
        await toDoList.deposit({from: account1, value: 100});
        await toDoList.deposit({from: account2, value: 200});
        const balance = await toDoList.getBalance();
        assert(balance == 300);
    })

    it('cannot deposit money twice if balance is not 0', async () => {
        expectRevert(toDoList.deposit({from: account1, value: 100}), 'can only deposit once')
    });

    it('cannot withdraw if there is task marked as incomplete', async () => {
        expectRevert(toDoList.withdraw({from: account1}), 'You still have incomplete tasks')
    });

    it('cannot update toDo is id does not exist', async () => {
        expectRevert(toDoList.updateToDo(5, {from: account1}), 'This todo does not exist');
    });

    it('can change status of todo to complete', async () => {
        const toDo = await toDoList.todos(account1, 0);
        assert(toDo.status === false);
        await toDoList.updateToDo(0);
        const changedToDo = await toDoList.todos(account1, 0);
        assert(changedToDo.status === true);
    });

    it('can withdraw if status for all tasks is true', async () => {
        await toDoList.withdraw()
        const balance = await toDoList.getBalance();
        assert(balance.toNumber() === 200);
    });

    it('can withdraw again if balance for individual account is back to 0', async () => {
        await toDoList.deposit({from: account1, value: 100});
        const balance = await toDoList.getBalance();
        assert(balance == 300);
    });

    it('can fetch todos', async () => {
        await toDoList.createToDo('another one!!!', {from: account1});
        const returnedTodos = await toDoList.getTodos({from: account1});
        let resultingTask1 = returnedTodos[1][0]
        let resultingTask2 = returnedTodos[1][1]
        assert(resultingTask1 == 'to test dApp');
        assert(resultingTask2 == 'another one!!!');
    })

})