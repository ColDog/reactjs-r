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
                <h2 className="articleTitle" onClick={this.handleClick}>{this.props.title}</h2>
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
