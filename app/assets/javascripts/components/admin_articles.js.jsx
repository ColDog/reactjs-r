/** @jsx React.DOM */

var AdminArticle = React.createClass({
    deleteObj: function() {
        this.props.onDelete(this.props.id);
    },

    render: function() {
        return (
            <tr id="article">
                <td><h5>{this.props.title}</h5></td>
                <td><div className="admin-body">{this.props.body}</div></td>
                <td>
                    <button className="btn"
                        onClick={this.deleteObj}
                    >
                        Delete
                    </button>
                </td>
            </tr>
        )
    }
});

var AdminArticleList = React.createClass({
    render: function() {
        var onDelete = this.props.onDelete;

        var articles = this.props.data.map(function(article) {
            return <AdminArticle
                key={article.title}
                id={article.id}
                title={article.title}
                body={article.body}
                onDelete={onDelete}
            />;
        });

        return (
            <div className="article-list">
                {articles}
            </div>
        )
    }
});

var ArticleForm = React.createClass({
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
    render: function() {
        return (
            <form className="articleForm" onSubmit={this.handleSubmit}>
                <input className="title" type="text" placeholder="Title" ref="title" />
                <textarea type="text" placeholder="Say something..." ref="body" />
                <input className="btn" type="submit" value="Post" />
            </form>
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
                this.setState({data: data});
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
                <h1>New Post</h1>
                <ArticleForm
                    onArticleSubmit={this.handleArticleSubmit}
                />
                <table>
                <h1>Posts</h1>
                <AdminArticleList
                    data={this.state.data}
                    onDelete={this.deleteObj}
                />
                </table>
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
