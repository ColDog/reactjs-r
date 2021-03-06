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
        this.props.onCommentSubmit({author: author, content: content, article_id: article});
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
        var created_at = typeof this.props.created_at === 'undefined'? 'just now' : $.format.prettyDate(this.props.created_at);
        return (
            <div className="comment">
                <h5 className="commentAuthor">
                {this.props.author}
                </h5>
                <div className="commentContent">
                    <span>{this.props.content}</span>
                </div>
                <h6>{created_at}</h6>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {

        var comments = this.props.data.map(function (comment) {
            return (
                <Comment
                    key={comment.id}
                    id={comment.id}
                    author={comment.author}
                    content={comment.content}
                    created_at={comment.created_at}
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
        var newComments = comments.concat(comment);
        this.setState({data: newComments});

        $.ajax({
            url: '/comments',
            dataType: 'json',
            type: 'POST',
            data: {comment: comment},
            success: function (data) {
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








