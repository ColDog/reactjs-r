/** @jsx React.DOM */

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var content = React.findDOMNode(this.refs.content).value.trim();
        var article = React.findDOMNode(this.refs.articleId).value.trim();
        if (!content || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, content: content, article_id: article });
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.content).value = '';
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="content" />
                <input type="hidden" ref="articleId" value={this.props.article} />
                <input className="btn" type="submit" value="Post" />
            </form>
        );
    }
});

var Comment = React.createClass({

    render: function() {
        return (
            <div className="comment">
                <h5 className="commentAuthor">
                {this.props.author}
                </h5>
                <div className="commentContent">
                    <span>{this.props.content}</span>
                </div>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {

        var comments = this.props.data.map(function (comment) {
            return (
                <Comment
                    key={comment.author}
                    id={comment.id}
                    author={comment.author}
                    content={comment.content}
                />
            );
        });
        return (
            <div className="commentList">
            {comments}
            </div>
        )
    }
});

var CommentBox;
CommentBox = React.createClass({

    handleCommentSubmit: function (comment) {
        var comments = this.state.data;
        var newComments = [comment].concat(comments);
        this.setState({data: newComments});

        $.ajax({
            url: '/comments',
            dataType: 'json',
            type: 'POST',
            data: {comment: comment},
            success: function (data) {
                this.setState({data: data});
                this.loadCommentsFromServer();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function () {
        return {data: this.props.data};
    },
    render: function () {
        return (
            <div className="commentBox">
                <h3>Comments</h3>
                <CommentForm
                    onCommentSubmit={this.handleCommentSubmit}
                    article={this.props.article}
                />
                <CommentList
                    data={this.state.data}
                />
            </div>
        );
    }
});

var Article = React.createClass({
    getInitialState: function() {
        return { show: false };
    },

    handleClick: function(event) {
        this.setState({show: !this.state.show});
    },

    render: function() {
        var rawMarkup = marked(this.props.body.toString(), {sanitize: true});
        var shown = this.state.show? 'show articleContent' : 'hidden articleContent';
        return (
            <div className="article">
                <h2 className="articleTitle" onClick={this.handleClick}>
                    {this.props.title}
                </h2>
                <div className={shown}>
                    <h6>Posted: {$.format.prettyDate(this.props.created_at)}</h6>
                    <div dangerouslySetInnerHTML={{__html: rawMarkup}} />
                    <CommentBox data={this.props.comments} article={this.props.id} />
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
                comments={article.comments}
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
