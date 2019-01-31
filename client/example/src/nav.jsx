import React, { Component } from 'react'
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import { Connect } from '../../src/actions';
import {formatTitle} from './tools/articleTools';
class Nav extends Component {

    render() {

        const { year, week, articleId, screen } = this.props.config;
        const article = screen === "ARTICLE" && this.props.app.articles.find(a => a.id === articleId);
        const title = article ? `${article.position}. ${formatTitle(article.title, article.title_en)}` : `Viikkotiedote`;
        return (
            <Breadcrumb>
                <BreadcrumbItem onClick={() => this.props.navigate('HOME')}><a href="javascript:void(0)">Viikkis {week}/{year}</a></BreadcrumbItem>
                {(screen === "ARTICLE" || screen === "SUMMARY") && <BreadcrumbItem active> {title}</BreadcrumbItem>}
            </Breadcrumb>
        )
    }
}

export default Connect(Nav)
