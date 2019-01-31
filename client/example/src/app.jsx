import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from 'reactstrap';
import { Connect } from '../../src/actions';
import './bootstrap.css';
import Header from './header';
import Login from './login';
import Main from './main';
import Nav from './nav';
import Summary from './summary';
import Year from './year';


const LoadingScreen = () => {
    return (
        <div style={styles.loader}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', padding: 40, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <h1 style={{ color: 'white' }}>Ladataan...</h1>
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height="100"
                    width="100"
                />
            </div>
        </div>
    )
}

const MainContainer = ({navigation}) => {
    return (
        <div>
            <Header />
            <Nav />
            <Container style={{ marginBottom: 20 }}>
                {
                    navigation()
                }
            </Container>
        </div>
    );
}

const AuthContainer = () => {
    return (
        <div>
            <Header />
            <Login />
        </div>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        this.props.socket.on('get rooms', (rooms) => this.props.setState({ rooms }));
        this.getText = (cb) => this.props.socket.on('get text', cb);
    }

    navigation() {
        switch (this.props.config.screen) {
            case 'SUMMARY':
                return <Summary />
            case 'ARTICLE':
                return <Main getText={this.getText} />
            default:
                return <Year />
        }
    }

    render() {
        return (
            <div>
                <ToastContainer
                    style={{ zIndex: 100000 }}
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
                {
                    this.props.app.loading && <LoadingScreen />
                }
                {
                    this.props.app.logged ? <MainContainer navigation={() => this.navigation()} /> : <AuthContainer />
                }
            </div>
        );
    }
}

export default Connect(App)

    const styles = {
        container: {
            backgroundColor: 'white',
            margin: 20,
            minHeight: 300,
            borderRadius: 5,
            border: '1px solid lightgray',
            maxWidth: 1200
        },
        navContainer: {
            margin: 20
        },
        loader: {
            zIndex: 10000,
            position: 'fixed',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.50)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white'
        }
    }

                    {/* <Switch>
            <Route exact path="/" component={Year} />
            <Route exact path="/summary" component={Summary} />
            <Route exact path="/article/:article" render={(props) => <Main getText={this.getText} {...props} />} />
        </Switch> */}