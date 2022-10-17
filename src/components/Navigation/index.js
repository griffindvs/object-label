import React, { useState } from 'react';

import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavbarText } from 'reactstrap';

function Navigation(props) {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="dark" dark expand="md">
                <NavbarBrand href="/">
                    Object Detection Dataset Builder
                </NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="me-auto" navbar>
                        { props.user.length > 0 &&
                            <NavbarText>
                                {props.user}
                            </NavbarText>
                        }
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
}

export default Navigation;