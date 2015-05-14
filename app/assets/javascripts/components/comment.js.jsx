/** @jsx React.DOM */

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.data.map(function (comment) {
            return (
                <Comment author={comment.author}>
                    {comment.content}
                </Comment>
            );
        });
        return (
            <div className="commentList">
            {commentNodes}
            </div>
        )
    }
});

var CommentForm = React.createClass({
    handleSubmit: function(e) {
        e.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var content = React.findDOMNode(this.refs.content).value.trim();
        if (!content || !author) {
            return;
        }
        this.props.onCommentSubmit({author: author, content: content});
        React.findDOMNode(this.refs.author).value = '';
        React.findDOMNode(this.refs.content).value = '';
        return;
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Your name" ref="author" />
                <input type="text" placeholder="Say something..." ref="content" />
                <input className="btn" type="submit" value="Post" />
            </form>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <h5 className="commentAuthor">{this.props.author}</h5>
                <p>{this.props.children}</p>
            </div>
        );
    }
});

var CommentBox;
CommentBox = React.createClass({
    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function (comment) {
        var comments = this.state.data;
        var newComments = [comment].concat(comments);
        this.setState({data: newComments});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: {comment: comment},
            success: function (data) {
                this.setState({data: data});
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="commentBox">
                <h5>Comments</h5>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
                <CommentList data={this.state.data} />
            </div>
        );
    }
});

var CommentContainer = React.createClass({
    render: function() {
        return(
            <CommentBox url="/comments.json" pollInterval={2000} />
        )
    }
});







