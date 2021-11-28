import React, { useEffect, useState } from 'react';
import ToDoList from './contracts/ToDoList.json';
import { getWeb3 } from './utils.js';

function App() {
    const [web3, setWeb3] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [balance, setBalance] = useState(0);
    const [toDos, setToDos] = useState([]);

    useEffect(() => {
        const init = async () => {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = ToDoList.networks[networkId];
            const contract = new web3.eth.Contract(
                ToDoList.abi,
                deployedNetwork && deployedNetwork.address,
            );
            setWeb3(web3);
            setAccounts(accounts);
            setContract(contract);
        }
        init();
        window.ethereum.on('accountsChanged', accounts => {
            setAccounts(accounts)
        });
    }, []);

    const isReady = () => {
        return (
            typeof contract !== 'undefined'
            && typeof web3 !== 'undefined'
            && typeof accounts !== 'undefined'
        );
    };

    async function updateBalance() {
        const balance = await contract.methods.getBalance().call({ from: accounts[0] });
        setBalance(balance)
    };

    async function depositFunds(e) {
        e.preventDefault();
        const amount = e.target.elements[0].value;
        document.getElementById('depositAmount').value = '';
        try {
            await contract.methods.deposit().send({ from: accounts[0], value: amount });
            document.getElementById('depositDiv').style.display = 'none';
        } catch (e) {
            alert(e.message)
        }
        updateBalance()
    };

    async function withdrawFunds() {
        try {
            await contract.methods.withdraw().send({ from: accounts[0] });
        } catch (e) {
            alert(e.message)
        }
        updateBalance();
    };

    async function submitToDo(e) {
        e.preventDefault();
        const task = e.target.elements[0].value;
        await contract.methods.createToDo(task).send({ from: accounts[0] });
        getToDos();
    };

    async function getToDos() {
        const listOfToDos = await contract.methods.getTodos().call({ from: accounts[0] })
        let toDo = []
        const neededLength = listOfToDos[0].length;
        for (let i = 0; i < neededLength; i++) {
            toDo.push([listOfToDos['0'][i], listOfToDos['1'][i], listOfToDos['2'][i]]);

        }
        setToDos(toDo)
    }

    async function updateTask(id) {
        await contract.methods.updateToDo(id).send({ from: accounts[0] });
        getToDos();
    }

    useEffect(() => {
        if (isReady()) {
            updateBalance();
            getToDos();
        }
    }, [accounts, contract]);

    if (!isReady()) {
        return <div>Contract has not loaded</div>;
    };



    return (
        <div className="container">
            <div>
                <p className="h1">Welcome to the BlockChain To-Do List</p>
            </div>
            <div className="row col-md-12">
                <p>This Dapp is pretty simple, make a to-do list, deposit ether and upon completion of tasks you can withdraw it.</p>
                <br />
                <p>We use the honour system, so be don't be a dick.</p>
            </div>
            <div className="row col-md-4">
                <span>Current Balace:&nbsp;</span><b><span id="balance_amount">{balance}</span>&nbsp;wei</b>
            </div>
            {balance <= 0 && (
                <div id="depositDiv">
                    <hr />
                    <div className="row">
                        <div className="col-md-6">
                            Deposit Money
                        </div>
                    </div>
                    <form onSubmit={e => depositFunds(e)}>
                        <div className="row">
                            <div className="col-md-2">
                                <input id="depositAmount" className="form-control" />
                            </div>
                            <div className="col-md-6 mt-10">
                                <button className="btn btn-info" type="submit">Deposit</button>
                            </div>
                        </div>
                    </form>
                </div>)}
            {balance > 0 && (
                <div id="withdrawDiv">
                    <hr />
                    <div className="row col-md-6">
                        <button onClick={withdrawFunds} className="btn btn-info" type="submit">Withdraw</button>
                    </div>
                </div>
            )}
            <div id="toDoDiv">
                <hr />
                <div className="row mt-30">
                    <h3>Write the task you need to do</h3>
                </div>
                <form onSubmit={e => submitToDo(e)}>
                    <div className="row col-md-6">
                        <input id="task" className="form-control" />
                        <label htmlFor="task" className="form-group">Enter your task</label>
                    </div>
                    <div className="row col-md-4">
                        <button type="submit" className="btn btn-info">Create To-Do</button>
                    </div>
                </form>
            </div>
            <div id="listToDo">
                <hr />
                <div className="row mb-50">
                    <h3>List of Tasks</h3>
                </div>
                <div className="row col-lg-6">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Task</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {toDos && toDos.map(todo => (
                                <tr key={todo[0]}>
                                    <td>{todo[1]}</td>
                                    {todo[2] === false ? (<td onClick={() => updateTask(todo[0])}><img src="https://img.icons8.com/material-sharp/64/000000/do-not-disturb.png" /></td>) : (<td onClick={() => updateTask(todo[0])}><img src="https://img.icons8.com/ios-glyphs/50/000000/task-completed.png" /></td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
};

export default App;