/** @jsx React.DOM */


var Comment = React.createClass({

    deleteObj: function() {                                                     // Handle the delete function for the article
        this.props.onDelete(this.props.id);
    },

    render: function() {
        return (
            <div className="comment">
                <h5 className="commentAuthor">
                {this.props.author}
                </h5>
                <div className="commentContent">
                {this.props.content}
                </div>
                <button className="btn"
                    onClick={this.deleteObj}>
                    Delete
                </button>
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var onDelete = this.props.onDelete;

        var comments = this.props.data.map(function (comment) {
            return (
                <Comment
                    key={comment.author}
                    id={comment.id}
                    author={comment.author}
                    content={comment.content}
                    onDelete={onDelete}
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

var CommentBox;
CommentBox = React.createClass({
    deleteObj: function(data_id) {
        var comments = this.state.data;
        var newComments = comments.filter(function(elem) {
            return elem.id = data_id;
        });

        this.setState({data: newComments});

        $.ajax({
            datatype: 'json',
            type: 'DELETE',
            cache: false,
            url: 'comments/' + data_id,
            success: function() {
                this.loadCommentsFromServer();
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    loadCommentsFromServer: function () {
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: true,
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
                this.loadCommentsFromServer();
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
    },
    render: function () {
        return (
            <div className="commentBox">
                <h5>Comments</h5>
                <CommentForm
                    onCommentSubmit={this.handleCommentSubmit}
                />
                <CommentList
                    data={this.state.data}
                    onDelete={this.deleteObj}
                />
            </div>
        );
    }
});

var CommentContainer = React.createClass({
    render: function() {
        return(
            <CommentBox url="/comments.json" />
        )
    }
});







