import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Connect } from '../../src/actions';
import Editor from '../../src/main';
import {Alert} from 'reactstrap'
import stylesheet from './app.module.scss';
import Beforeunload from 'react-beforeunload';

class Main extends Component {
    constructor(props) {
        super(props);
        console.log('prop', this.props)
        this.props.getText(value => this.setState({ value }));
        this.id = this.props.config.articleId;
        this.state = {
            value: '',
            autoSave: true,
            previousValue: ''
        }
    }

    componentDidMount() {
        this.props.getArticle(this.id)
            .then(({ action: { payload: { data } } }) => {
                this.setState({
                    value: data.text,
                    previousValue:data.text
                });

                this.props.socket.emit('join room', data);
                this.interval = setInterval(() => {
                    if (this.isEdited()) {
                        this.setState({previousValue:this.state.value});
                        this.handleSave()
                    }
                }, 60000);
            })
            .catch(e => {
                this.props.navigate('HOME');
            })
    }

    isEdited(){
        return this.state.value !== this.state.previousValue
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    handleChange = value => {
        this.setState({
            value,
        });
        this.props.socket.emit('set text', value);
    }

    handleSave() {
        this.props.updateArticle({ id: this.id, text: this.state.value })
            .then(() => toast.success("Artikkeli tallennettu"))
            .catch(() => toast.error("Virhe tallennettaessa artikkelia"))
    }

    socketsOnline(){
        const {rooms} = this.props.app;
        const sockets = rooms[this.id] ? rooms[this.id].sockets : [];
        return sockets.length > 1;
    }

    render() {
        let { value } = this.state
        
        const editorStyle = {
            boxShadow: '#999 0 0 12px',
            borderRadius: '4px'
        }
        return (
            <div style={{height:'100%'}}>
                {this.isEdited() && <Beforeunload onBeforeunload={() => "Haluatko varmasti poistua? Viimeisempiä muutoksia ei ole tallennettu."} />}
                {this.socketsOnline() && <Alert color="warning">
                    Toinen käyttäjä on muokkaamassa tiedostoa!
                </Alert>}
            <div style={editorStyle}>
                <Editor
                    value={value}
                    onChange={this.handleChange}
                    onSave={() => this.handleSave()}
                />
            </div>
            </div>
        )
    }
}

export default Connect(Main)
