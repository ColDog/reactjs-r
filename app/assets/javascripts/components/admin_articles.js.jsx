/** @jsx React.DOM */

var AdminArticle = React.createClass({
    getInitialState: function() {
        return { show: false, edit: false };
    },

    deleteObj: function() {
        this.props.onDelete(this.props.id);
    },

    handleClick: function(event) {
        this.setState({show: !this.state.show});
    },

    handleEdit: function(event) {
        this.setState({edit: !this.state.edit});
    },

    handleUpdate: function() {
        this.props.onUpdate({
            id: this.props.id,
            title: this.props.title,
            body: $('#' + this.props.id).val()
        })
    },

    render: function() {
        var shown = this.state.show? 'admin-show' : 'admin-hidden';
        var editable = this.state.edit? 'admin-show' : 'admin-hidden';
        return (
            <tr id="article">
                <td><h5>{this.props.title}</h5></td>
                <td>
                    <div className={shown}>{this.props.body}</div>
                    <div className={editable}>
                    <textarea id={this.props.id} defaultValue={this.props.body}></textarea>
                    </div>
                </td>
                <td>
                    <button className="btn" onClick={this.deleteObj}>
                        Delete
                    </button>
                    <button className="btn" onClick={this.handleClick}>
                        Show
                    </button>
                    <button className="btn" onClick={this.handleUpdate}>
                        Update
                    </button>
                    <button className="btn" onClick={this.handleEdit}>
                        Edit
                    </button>
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
                key={article.title}
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
        var newArticles = articles.concat([article]);
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

    handleUpdate: function (article) {
        $.ajax({
            url: '/articles/' + article.id,
            dataType: 'json',
            type: 'PATCH',
            data: {article: {title: article.title, body: article.body}},
            success: function (data) {
                // set the content equal to the new data
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
