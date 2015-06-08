/** @jsx React.DOM */

var AdminArticle = React.createClass({
    getInitialState: function() {
        return { edit: false, flash: false, full: false };
    },
    deleteObj: function() {
        this.props.onDelete(this.props.id);
    },
    handleEdit: function(event) {
        this.setState({edit: !this.state.edit});
    },
    fullScreen: function(event) {
        this.setState({full: !this.state.full});
    },
    textClick: function() {
        this.setState({edit: true});
    },
    handleUpdate: function() {
        this.props.onUpdate({
            id: this.props.id,
            title: this.props.title,
            body: $('#' + this.props.id).val()
        });
        this.setState({flash: true});
    },
    handleHide: function() {
        this.setState({flash: false})
    },

    render: function() {
        var editable = this.state.edit? 'admin-show' : 'admin-hidden';
        var flash = this.state.flash? 'show flash' : 'hide flash';
        var name = this.state.edit? 'Hide' : 'Show';
        var fullScreen = this.state.full? 'full edit' : 'edit';
        return (
            <tr id="article">
                <td className="short"><h4>{this.props.title}</h4></td>
                <td className="medium">
                    <div className={editable}>
                        <div className={fullScreen}>
                            <textarea onClick={this.textClick} id={this.props.id} defaultValue={this.props.body} />
                            <button className="btn" onClick={this.fullScreen} >
                                Full Screen
                            </button>
                        </div>
                    </div>
                </td>
                <td className="short">
                    <button className="btn" onClick={this.handleEdit}>
                        {name}
                    </button>
                    <button className="btn" onClick={this.handleUpdate} >
                        Update
                    </button>
                    <button className="btn" onClick={this.deleteObj}>
                        Delete
                    </button>
                    <div className={flash} onClick={this.handleHide} >&#x2713; Updated</div>
                </td>
            </tr>
        )
    }
});


var AdminArticleList = React.createClass({
    render: function() {
        var onDelete = this.props.onDelete;

        var onUpdate = this.props.onUpdate;

        var articles = this.props.data.map(function(article) {
            return <table>
            <AdminArticle
                key={article.id}
                id={article.id}
                title={article.title}
                body={article.body}
                onDelete={onDelete}
                onUpdate={onUpdate}
            />
            </table>;
        });

        return (
            <div className="article-list">
                {articles}
            </div>
        )
    }
});

var ArticleForm = React.createClass({
    getInitialState: function() {
        return { show: false };
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var title = React.findDOMNode(this.refs.title).value.trim();
        var body = React.findDOMNode(this.refs.body).value.trim();
        if (!body || !title) {
            return;
        }
        this.props.onArticleSubmit({title: title, body: body});
        React.findDOMNode(this.refs.title).value = '';
        React.findDOMNode(this.refs.body).value = '';
        return;
    },
    handleShow: function() {
        this.setState({show: !this.state.show})
    },
    render: function() {
        var show = this.state.show? 'show-form new-form' : 'hide-form new-form';
        return (
            <div className="new-post">
                <button className="btn big" onClick={this.handleShow}>New Post</button>
                <div className={show}>
                <br />
                <form className="articleForm" onSubmit={this.handleSubmit}>
                    <input className="title" type="text" placeholder="Title" ref="title" />
                    <textarea type="text" placeholder="Say something..." ref="body" />
                    <input className="btn" type="submit" value="Post" />
                </form>
                <br />
                </div>
            </div>
        );
    }
});


var AdminArticleBox = React.createClass({

    deleteObj: function(data_id) {
        var articles = this.state.data;
        var newArticles = articles.filter(function(elem) {
            return elem.id = data_id;
        });
        this.setState({data: newArticles});
        $.ajax({
            datatype: 'json',
            type: 'DELETE',
            cache: false,
            url: 'articles/' + data_id,
            success: function() {
                this.loadArticlesFromServer();
            }.bind(this)
        });
    },

    loadArticlesFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({data: data});
            }.bind(this)
        });
    },

    handleArticleSubmit: function (article) {
        var articles = this.state.data;
        var newArticles = [article].concat(articles);
        this.setState({data: newArticles});
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: {article: article},
            success: function (data) {
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleUpdate: function (article) {
        $.ajax({
            url: '/articles/' + article.id,
            dataType: 'json',
            type: 'PATCH',
            data: {article: {title: article.title, body: article.body}},
            success: function (data) {
                this.loadArticlesFromServer();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadArticlesFromServer();
    },
    render: function() {
        return (
            <div className="articleBox">
                <ArticleForm
                    onArticleSubmit={this.handleArticleSubmit}
                />
                <h1>Posts</h1>
                <AdminArticleList
                    data={this.state.data}
                    onDelete={this.deleteObj}
                    onUpdate={this.handleUpdate}
                />
            </div>
        )
    }
});

var AdminArticleContainer = React.createClass({
    render: function() {
        return(
            <AdminArticleBox url={'/articles.json'}/>
        )
    }
});