/** @jsx React.DOM */

var Article = React.createClass({
    getInitialState: function() {
        return { show: false };                                                 // State for show or hidden class applied to article
    },

    handleClick: function(event) {                                              // On clicking title set class of article to show from hidden
        this.setState({show: !this.state.show});
    },

    deleteObj: function() {                                                     // Handle the delete function for the article
        this.props.onDelete(this.props.id);
    },

    render: function() {                                                        // Render the individual article
        var rawMarkup = marked(this.props.body.toString(), {sanitize: true});   // Uses markdown to render each article
        var shown = this.state.show? 'show' : 'hidden';
        return (
            <div id="article">
                <h2 className="articleTitle" onClick={this.handleClick}>
                {this.props.title}
                </h2>
                <button className="btn" onClick={this.deleteObj}>
                    Delete
                </button>

                <div id="articleContent" className={shown}
                    dangerouslySetInnerHTML={{__html: rawMarkup}}
                />
            </div>
        )
    }
});

var ArticleList = React.createClass({
    render: function() {
        var onDelete = this.props.onDelete;

        var articles = this.props.data.map(function(article) {
            return <Article
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

var ArticleBox = React.createClass({

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


    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadArticlesFromServer();
    },

    render: function() {
        return (
            <div className="articleBox">
                <ArticleList
                    data={this.state.data}
                    onDelete={this.deleteObj}
                />
                <ArticleForm
                    onArticleSubmit={this.handleArticleSubmit}
                />
            </div>
        )
    }
});

var ArticleContainer = React.createClass({
    render: function() {
        return(
            <ArticleBox url={'/articles.json'}/>
        )
    }
});
