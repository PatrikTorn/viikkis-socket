import moment from 'moment';
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { Connect } from '../../src/actions';
import Week from './week';
class Year extends Component {

    state = {
        failed: true,
        loaded: false
    }
    componentDidMount() {
        this.init();
        this.props.socket.emit('leave room');
    }

    async init() {
        try {
            await this.props.getWeekArticles({ year: this.props.config.year, week: this.props.config.week })
            this.setState({ failed: false, loaded: true })
        } catch (e) {
            toast.error('Ei internet yhteyttä palvelimeen');
            this.setState({ failed: true, loaded: true })
        }
    }

    render() {
        const { year, week, now } = this.props.config;
        const startOfWeek = moment(now).startOf('isoWeek');
        const endOfWeek = moment(now).endOf('isoWeek');
        const { loaded, failed } = this.state;
        return (
            <div style={styles.wrapper}>
                <div style={styles.container}>
                    <div style={styles.left} onClick={() => this.props.setPrevWeek()}><h1 class="fa fa-angle-left" ></h1></div>
                    <div style={styles.center}>
                        <h1>Viikko {week}</h1>
                        <h3>{startOfWeek.format('DD.MM.YYYY')} - {endOfWeek.format('DD.MM.YYYY')}</h3>
                    </div>
                    <div style={styles.right} onClick={() => this.props.setNextWeek()}><h1 class="fa fa-angle-right"></h1></div>
                </div>
                {loaded && !failed && <Week week={week} year={year} />}
            </div>

        )
    }
}

export default Connect(Year)

const styles = {
    wrapper: {
        backgroundColor: 'white',
        boxShadow: '#999 0 0 12px',
        borderRadius: '4px',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        display: 'flex'
    },
    left: {
        flex: 0.1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor:'rgba(0,0,0,0.15)'
    },
    center: {
        flex: 0.8,
        flexDirection: 'column',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    right: {
        flex: 0.1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backgroundColor:'rgba(0,0,0,0.15)'
    }
}



//   let {year} = this.props.match.params;
//   year = parseInt(year);
//   const allWeeks = this.props.app.articles
//     .filter(a => a.year === year)
//     .map(p => p.week);
//   const weeks = [...new Set(allWeeks)]
{/* 
            <ListGroup>
            {
                weeks.map(week => (
                    <ListGroupItem key={week}>
                        <Link to={`/${year}/${week}`}>Viikko {week}</Link>
                    </ListGroupItem>
                ))
            }
            </ListGroup> */}