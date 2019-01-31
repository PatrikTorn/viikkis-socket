import React, { Component } from 'react';
import {
    Container, Col, Form,
    FormGroup, Label, Input,
    Button,
} from 'reactstrap';
import { Connect } from '../../src/actions';
import { toast } from 'react-toastify';
// import './App.css';

class Login extends Component {
    state = {
        email: '',
        password: ''
    }

    login() {
        this.props.login({password:this.state.password, email:this.state.email})
        .catch(() => toast.error('Väärä käyttäjätunnus tai salasana'))
    }

    render() {
        const styles = {
            container: {
                boxShadow: '#999 0 0 12px',
                borderRadius: '4px',
                backgroundColor: 'white',
                padding: 20,
                margin: 10
            },
            wrapper: {
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0
            }
        }
        return (
            <div style={styles.wrapper}>
                <Container style={styles.container}>
                    <h2>Kirjaudu sisään</h2>
                    <Form className="form">
                        <Col>
                            <FormGroup>
                                <Label>Sähköposti</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="exampleEmail"
                                    placeholder="sposti@sposti.com"
                                    value={this.state.email}
                                    onChange={e => this.setState({ email: e.target.value })}
                                />
                            </FormGroup>
                        </Col>
                        <Col>
                            <FormGroup>
                                <Label for="examplePassword">Salasana</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="examplePassword"
                                    placeholder="********"
                                    onChange={e => this.setState({ password: e.target.value })}
                                    value={this.state.password}
                                />
                            </FormGroup>
                        </Col>
                        <Button onClick={() => this.login()}>Kirjaudu sisään</Button>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default Connect(Login);