import React, { useState } from 'react';

import { Container, Card, Button, Form, FormGroup, Label, Input } from 'reactstrap';

import './index.css';

function InputUser(props) {
    const [validInput, setValidInput] = useState(true)
    const [email, setEmail] = useState("")

    // Check if email has @utdallas.edu domain
    function checkEmail(email) {
        let validRegex = new RegExp('^[A-Za-z0-9._%+-]+@utdallas.edu$');
        return validRegex.test(email);
    }

    // Update state to match form input
    function handleEmailChange(event) {
        event.persist();
        setEmail(event.target.value);
    }

    // Validate email and pass up to higher level component App
    function handleSubmit() {
        let valid = checkEmail(email);
        if (valid) {
            props.onUserChange(email);
        } else {
            setValidInput(false);
        }
    }

    return (
        <div className="inputUser">
            <Container>
                <Card className="inputUserCard">
                    <Form>
                        <FormGroup>
                            <Label for="emailInput">
                                Enter your UT Dallas email
                            </Label>
                            <Input 
                                value={email}
                                onChange={handleEmailChange}
                                name="email"
                                type="text"
                                placeholder="example@utdallas.edu"
                                invalid={!validInput}
                                id="emailInput"
                            />
                            { !validInput && <p className="text-danger inputUserFeedback">Please input an email address ending in @utdallas.edu</p> }
                        </FormGroup>
                        <Button onClick={handleSubmit} className="inputUserSubmit" color="primary">Submit</Button>
                    </Form>
                </Card>
            </Container>
        </div>
    );
}

export default InputUser;