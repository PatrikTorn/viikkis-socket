import React, { Component } from 'react'
import { Connect } from '../../src/actions';
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap';
import { formatTitle } from './tools/articleTools';

class CreateWeek extends Component {

    state = {
        titles: [
            {
                fi: 'Yleistä',
                en: 'General'
            },
            {
                fi: 'Indecsin tapahtumat',
                en: "Indecs events"
            },
            {
                fi: "TREY tiedottaa",
                en: "Student Union announces"
            },
            {
                fi: "Tampereen Teekkarit tiedottaa",
                en: "Teekkari Union of Tampere announces"
            },
            {
                fi: "Yritystiimi tiedottaa",
                en: "Corporate Relations Team announces"
            },
            {
                fi: "Tulevat tapahtumat",
                en: "Upcoming events"
            },
            {
                fi: "ESTIEM asiaa",
                en: "ESTIEM affairs"
            },
            {
                fi: "Loppukevennys",
                en: ""
            }
        ],

    }
    createWeek() {
        if (this.state.titles.find(t => t.fi.trim() === "")) {
            alert("Kaikki suomenkieliset kentät ovat pakollisia!");
            return;
        }
        const articles = this.state.titles.map((title, i) => ({
            year: this.props.year,
            week: this.props.week,
            position: i + 1,
            title: title.fi,
            title_en: title.en,
            text: `# ${formatTitle(title.fi, title.en)} \n\n`,
            text_en: ``
        }));
        this.props.createWeek(articles)
    }

    deleteHeading(i) {
        this.setState({
            titles: this.state.titles.reduce((acc, obj, ind) => ind === i ? acc : [...acc, obj], [])
        });
    }

    render() {
        const { titles } = this.state;
        return (
            <div style={{ backgroundColor: 'white', padding: 20 }}>
                <Form>
                    {
                        titles.map((title, i) => (
                            <div style={styles.box}>
                                <Button style={styles.button}color="danger" onClick={() => this.deleteHeading(i)}>X</Button>
                                <FormGroup key={i} row >
                                    <div style={styles.index}><h2>{i+1}.</h2></div>
                                    <Label for={`fi`} sm={2}>Otsikko (fi)</Label>
                                    <Col sm={10}>
                                        <Input type="text" name={`fi`} required placeholder="Otsikko suomeksi (pakollinen)" value={title.fi} onChange={(e) => this.setState({ titles: titles.map((t, ind) => i === ind ? ({ ...t, fi: e.target.value }) : t) })} />
                                    </Col>
                                    <Label for={`en`} sm={2}>Otsikko (en)</Label>
                                    <Col sm={10}>
                                        <Input type="text" name={`en`} placeholder="Otsikko englanniksi (ei pakollinen)" value={title.en} onChange={(e) => this.setState({ titles: titles.map((t, ind) => i === ind ? ({ ...t, en: e.target.value }) : t) })} />
                                    </Col>
                                </FormGroup>

                            </div>
                        ))
                    }
                    <Button color="info" block onClick={() => this.setState({ titles: [...titles, { fi: '', en: '' }] })}>Lisää uusi otsikko</Button>
                    <Button color="success" size="lg" block onClick={() => this.createWeek()}>Luo viikkis!</Button>
                </Form>
            </div>

        )
    }
}

export default Connect(CreateWeek)

const styles = {
    box:{
        position:'relative',
        margin:10,
        backgroundColor:'rgba(0,0,0,0.07)',
        borderRadius:3,
        boxShadow: '#999 0 0 7px',
        border:'1px solid darkgray',
        padding:`10px 50px 10px 50px`
    },
    button:{
        position:'absolute', top:0, right:0, zIndex:999
    },
    index:{
        position:'absolute', top:2, left:2, zIndex:999
    }
}