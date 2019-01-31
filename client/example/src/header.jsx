import React, { Component } from 'react'
import {Connect} from '../../src/actions';
class Header extends Component {
  render() {

    return (
        <div>
          <div style={styles.top}>
            <div style={styles.left}>
              <img src={'https://indecs.fi/indecs-fi/wp-content/uploads/2019/01/Indecs_logo_teksti.png'} style={{height:60}}/>
              <i>Viikkis</i>
            </div>
            <div style={styles.nav}>
            </div>
            {this.props.app.logged && <div style={styles.right} onClick={() => this.props.logout()}>
              Kirjaudu ulos
            </div>}
          </div>
        </div>
    )
  }
}

export default Connect(Header)

const styles = {
  top:{
    backgroundColor:'rgba(0,0,0,0.8)',
    height:60,
    width:'100%',
    display:'flex',
    flexDirection:'row',
    flex:1,
    color:'white'
  },
  left:{
    display:'flex',
    alignItems:'center',
    flex:0.25,
    fontSize:40
  },
  nav:{
    display:'flex',
    flex:0.5,
    alignItems:'center',
    justifyContent:'center'
  },
  right:{
    display:'flex',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingRight:20,
    flex:0.25,
    cursor:'pointer'
  },
}