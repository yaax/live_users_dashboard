import React, { useState, useEffect } from 'react';
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper"
import Popup from './Popup';
import config from "./config";

import "./App.css";

const Dashboard = () => {
    let name=localStorage.getItem('name');
    let timer=null;

    if (!name) {
        name="Unknown user";
    }

    const [userData, setUserData] = useState({});
    const [userDetails, setUserDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const getUsers = async () => {
        setIsLoading(true);
        setIsError(false);
        let jsonData;
        let session_id=localStorage.getItem('session_id');
        let session_id_term="?session_id="+session_id;
        if (!session_id) {
            session_id_term="";
        }
        try {
            const response = await fetch(config.apiListUsersUrl+session_id_term);
            jsonData = await response.json();
        } catch (error) {
            setIsError(true);
        }
        setUserData(jsonData);
        setIsLoading(false);
    };

    useEffect(() => {
        getUsers();
        timer = setInterval(() => getUsers(), config.ping_delay);
        return () => {
            clearInterval(timer);
            timer = null;
        };
    }, []);

    const getUser = async (hash) => {
        setIsLoading(true);
        setIsError(false);
        let jsonData;
        let session_id=localStorage.getItem('session_id');
        let session_id_term="&session_id="+session_id;
        if (!session_id) {
            session_id_term="";
        }
        try {
            const response = await fetch(config.apiGetUserUrl+'?hash='+hash+session_id_term);
            jsonData = await response.json();
        } catch (error) {
            setIsError(true);
        }
        setUserDetails(jsonData);
        setIsLoading(false);
    };

    const handleCellClick = (e) => {
        getUser(e.target.getAttribute('row_id'));
        togglePopup();
    }

    return (
        <div className="App">
            <div className="user-container">
                <h1>Welcome {name}</h1>
                <h3>Current online users list</h3>
            </div>
            {isError && <div>Something went wrong ...</div>}
            {isLoading ? (
                <div>Loading ...</div>
            ) : (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Entrance time</TableCell>
                            <TableCell>Update time</TableCell>
                            <TableCell>IP</TableCell>
                            <TableCell>Session ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(userData).map(index => (
                            <TableRow id={userData[index].hash} key={index} onClick={handleCellClick}>
                                <TableCell row_id={userData[index].hash}>{userData[index].name}</TableCell>
                                <TableCell row_id={userData[index].hash}>{userData[index].created}</TableCell>
                                <TableCell row_id={userData[index].hash}>{userData[index].updated}</TableCell>
                                <TableCell row_id={userData[index].hash}>{userData[index].ip}</TableCell>
                                <TableCell row_id={userData[index].hash}>{userData[index].session_id}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>)}
            {isOpen && <Popup component={Popup} content={<>
                <b>Details of user</b>
                <p>Name: {userDetails.name}</p>
                <p>Email: {userDetails.email}</p>
                <p>User-Agent: {userDetails['user-agent']}</p>
                <p>Visits: {userDetails.visits}</p>
                <p> Entrance time: {userDetails.created}</p>
                <button onClick={togglePopup}>Ok</button>
            </>}
              handleClose={togglePopup}
            />}
        </div>

    );
};

export default Dashboard;