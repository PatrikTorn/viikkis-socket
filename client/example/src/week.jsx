import React, { Component } from 'react';
import { Badge, Button, ListGroup, ListGroupItem } from 'reactstrap';
import { Connect } from '../../src/actions';
import CreateWeek from './create_week';
import { formatTitle, lastEdited } from './tools/articleTools';
class Week extends Component {

    socketsOnline(id) {
        const { rooms } = this.props.app;
        const sockets = rooms[id] ? rooms[id].sockets : [];
        return sockets.length > 0;
    }

    deleteArticle(id) {
        const bool = window.confirm('Haluatko varmasti poistaa artikkelin?');
        if (bool) {
            this.props.deleteArticle(id)
        }
    }


    render() {
        const articles = this.props.app.articles.sort((a, b) => a.position - b.position)

        return articles.length === 0 ? (
            <CreateWeek year={this.props.year} week={this.props.week} />
        ) : (
                <React.Fragment>
                    <Button block color="success" onClick={() => this.props.navigate('SUMMARY')}>Näytä kooste viikkotiedotteesta</Button>
                    <ListGroup flush>
                        {
                            articles.map(article => (

                                <ListGroupItem key={article.id} >
                                    <a href="javascript:void(0)" onClick={() => this.props.setConfigState({ articleId: article.id, screen: 'ARTICLE' })}>
                                        {article.position}. {formatTitle(article.title, article.title_en)}
                                    </a>
                                    <br />

                                    <Badge color="success">{article.text.length} merkkiä</Badge> {' '}
                                    <Badge color="warning">{lastEdited(article.edited_at)}</Badge> {' '}
                                    {this.socketsOnline(article.id) && <Badge color="info">joku muokkaamassa</Badge>}
                                    
                                    <Button color="danger" outline size="sm" style={{ float: 'right' }} onClick={() => this.deleteArticle(article.id)}>X</Button>

                                </ListGroupItem>
                            ))
                        }
                    </ListGroup>
                </React.Fragment>
            )
    }
}

export default Connect(Week)