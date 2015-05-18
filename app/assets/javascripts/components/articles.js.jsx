/** @jsx React.DOM */

var Article = React.createClass({
    getInitialState: function() {
        return { show: false };
    },

    handleClick: function(event) {
        this.setState({show: !this.state.show});
    },

    render: function() {
        var rawMarkup = marked(this.props.body.toString(), {sanitize: true});
        var shown = this.state.show? 'show' : 'hidden';
        return (
            <div className="article">
                <h2 className="articleTitle" onClick={this.handleClick}>
                    {this.props.title}
                </h2>
                <div className="articleContent">
                    <div className={shown}
                        dangerouslySetInnerHTML={{__html: rawMarkup}}
                    />
                    <h6>Posted: {$.format.prettyDate(this.props.created_at)}</h6>
                </div>
            </div>
        )
    }
});

var ArticleList = React.createClass({
    render: function() {

        var articles = this.props.data.map(function(article) {
            return <Article
                key={article.title}
                id={article.id}
                title={article.title}
                body={article.body}
                created_at={article.created_at}
            />;
        });

        return (
            <div className="article-list">
                {articles}
            </div>
        )
    }
});


var ArticleBox = React.createClass({

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

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadArticlesFromServer();
    },

    render: function() {
        return (
            <div className="articleBox">
                <ArticleList data={this.state.data} />
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
