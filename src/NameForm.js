import React from 'react';

import './NameForm.scss'

import { v4 as uuid } from 'uuid';

import config from "./config";

class NameForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = {name: '', email: '', error: ''};

        this.nameRef = React.createRef();
        this.emailRef = React.createRef();

        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangeEmail = this.handleChangeEmail.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.apiListUsersUrl = config.apiListUsersUrl;
    }

    handleChangeName(event) {
        this.setState({name: event.target.value});
    }

    handleChangeEmail(event) {
        this.setState({email: event.target.value});
    }

    async pingOnline() {
        let session_id=localStorage.getItem('session_id');
        if (!session_id) {
            return false;
        }
        let session_id_term="?session_id="+session_id;
        let jsonData=null;

        const response = await fetch(this.apiListUsersUrl+session_id_term);
        jsonData = await response.json();

        document.getElementById("result_message").style.display="none";

        return jsonData
    }

    handleSubmit(event) {
        let session_id=localStorage.getItem('session_id');
        if (!session_id) {
            session_id=uuid();
        }

        const data = new FormData();
        data.append("name", this.nameRef.current.value);
        data.append("email", this.emailRef.current.value);
        data.append("session_id", session_id);

        let output=data.toString();
        if (!this.emailValidation()) {
            output+=this.state.error;
            alert(output);
            event.preventDefault();
            return;
        }

        localStorage.setItem('name',data.get('name'));
        localStorage.setItem('email',data.get('email'));
        localStorage.setItem('session_id',session_id);

        let queryString = new URLSearchParams(data).toString();

        fetch(config.api_host+"save_data?"+queryString, {
            method: "GET",
            //body: data
        })
        .then(response => response.json())
        .then(() => {
            document.getElementById("result_message").style.display="block";
        })
        .catch((err) => console.warn("error: "+err));

        let timer = setInterval(() => this.pingOnline(), config.ping_delay);

        event.preventDefault();
    }

    emailValidation(){
        const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if(!this.state.email || regex.test(this.state.email) === false){
            this.state.error= "   Email is not valid";
            return false;
        }
        return true;
    }

    render() {
        return (
            <div  className="container">
                <h1>Enter your details:</h1>
                <form onSubmit={this.handleSubmit} className="form">
                    <div className="name">
                        <label id="for_name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="name"
                            placeholder="Your Name"
                            ref={this.nameRef}
                            onChange={this.handleChangeName}
                        />
                    </div>
                    <div className="name">
                        <label id="for_email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="name"
                            placeholder="example@corp.com"
                            ref={this.emailRef}
                            onChange={this.handleChangeEmail}
                        />
                    </div>

                    <button type="submit" className="send">Send</button>
                    <div id="result_message">Data was saved successfully!</div>
                </form>
            </div>
        );
    }
}

export default NameForm;