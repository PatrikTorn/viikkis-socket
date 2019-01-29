import React, { Component, Fragment } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container} from 'reactstrap'
import {Connect} from '../../src/actions';
import stylesheet from './app.module.scss'
import { BrowserRouter, Route, Redirect, Switch} from 'react-router-dom'
import Header from './header'
import Nav from './nav'
import Main from './main';
import Year from './year';
import Summary from './summary';
import Login from './login';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Loader = () => {
    return (
        <div style={styles.loader}>
            Loading...
        </div>
    )
}

class App extends Component {
    constructor(props){
        super(props);
        this.props.socket.on('get rooms', (rooms) => this.props.setState({rooms}));
        this.getText = (cb) => this.props.socket.on('get text', cb);
    }
    componentDidMount(){
        this.props.getArticles();
    }


  render() {

    return !this.props.app.logged ? 
    <Fragment>
        <Header />
        <Login />
    </Fragment> : (
        <BrowserRouter>
        <Fragment>
            <Header />
            {this.props.app.loading && <Loader />}
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnVisibilityChange
                draggable
                pauseOnHover={false}
            />
            <Route component={Nav} />
            <Container>
                <Route exact path="/" component={Year} />
                <Route exact path="/summary" component={Summary} />
                <Route exact path="/article/:article" render={(props) => <Main getText={this.getText} {...props} />} />
            </Container>
        </Fragment>
      </BrowserRouter>
    )
  }
}

export default Connect(App)

const styles = {
    container:{
        backgroundColor:'white',
        margin:20,
        minHeight:300,
        borderRadius:5,
        border:'1px solid lightgray',
        maxWidth:1200
    },
    navContainer:{
        margin:20
    },
    loader: {
        position:'absolute',
        top:0,
        left:0,
        bottom:0,
        right:0,
        backgroundColor:'rgba(0,0,0,0.42)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        color:'white'
    }
}