/** @jsx React.DOM */

var Article = React.createClass({
    getInitialState: function() {
        return { show: false };                                                 // State for show or hidden class applied to article
    },

    handleClick: function(event) {                                              // On clicking title set class of article to show from hidden
        this.setState({show: !this.state.show});
    },

    render: function() {                                                        // Render the individual article
        var rawMarkup = marked(this.props.body.toString(), {sanitize: true});   // Uses markdown to render each article
        var shown = this.state.show? 'show' : 'hidden';
        return (
            <div id="article">
                <h2 className="articleTitle" onClick={this.handleClick}>
                {this.props.title}
                </h2>

                <div id="articleContent" className={shown}
                    dangerouslySetInnerHTML={{__html: rawMarkup}}
                />
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
