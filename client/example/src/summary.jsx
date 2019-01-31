import React, { Component } from 'react'
import Editor from '../../src/main'
import {Connect} from '../../src/actions';
import {Button, Label, Input, Form, FormGroup} from 'reactstrap'
import Modal from 'react-responsive-modal'
import queryString from 'query-string'
class Main extends Component {
  constructor(props) {
    super(props);
    this.year = this.props.config.year;
    this.week = this.props.config.week;
    this.state = {
      value:'',
      config:`
otsikon_ylle: Tuotantotalouden kilta Indecs
otsikon_alle: Viikko 1
sposti_aihe: Indecsin Viikkotiedote 1 — Indecs' Newsletter 1
url: http://www.google.fi
nimi: Leevi Törnblom
titteli: Sihteeri / Secretary
kilta: Tuotantotalouden kilta Indecs Ry
guild: Guild of Industrial Engineering and Management Indecs
yliopisto: Tampereen teknillinen yliopisto
university: Tampere University of Technology
puhelin: 0408431989
sposti: sihteeri@indecs.fi
internet: www.indecs.fi
`,
      showModal:false
    }
  }

  componentDidMount(){
    this.props.getSummary({year:this.year, week:this.week})
  }

  toggleModal(){
    this.setState({showModal:!this.state.showModal})
  }
  
  exportFile() {
    let element = document.createElement("a");
    let toc = `

# Sisällysluettelo - Table of Contents

[TOC]

`;
    let text = (this.state.config + toc + this.props.app.summary).replace(/\n/g, "\r\n");
    let file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${this.year}-${this.week}-viikkis.md`;
    element.click();
  }

  render() {
    const { value } = this.state
    const editorStyle = {
      boxShadow: '#999 0 0 12px',
      borderRadius: '4px'
    }

    return (
      <React.Fragment>

        <Modal open={this.state.showModal} onClose={() => this.toggleModal()} center>
            <div style={{minHeight:300, width:600}}>
              <Form>
                <FormGroup>
                  <Label for="config">Määritä sihteerin asetukset</Label>
                  <Input type="textarea" style={{ height: 200 }} id="config" value={this.state.config} onChange={e => this.setState({config:e.target.value})} />
                  <Button color="success" block onClick={() => this.exportFile()}>Lataa!</Button>
                </FormGroup>
              </Form>
            </div>
        </Modal>
        
        <Button color="success" block onClick={() => this.toggleModal()}>Lataa viikkis .md-muodossa</Button>
        <div style={editorStyle}>
          <Editor
            value={this.props.app.summary}
            onChange={() => {}}
            onSave={() => {}}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Connect(Main)
