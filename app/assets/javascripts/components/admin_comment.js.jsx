/** @jsx React.DOM */


var AdminComment = React.createClass({

    deleteObj: function() {
        this.props.onDelete(this.props.id);
    },

    render: function() {
        return (
            <tr className="comment">
                <td>
                    <h5 className="commentAuthor">{this.props.author}</h5>
                    <h6>From Article: {this.props.article.title}</h6>
                </td>
                <td>
                    <div className="commentContent">
                        <small>{this.props.content}</small>
                    </div>
                </td>
                <td>
                    <button className="btn" onClick={this.deleteObj}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }
});

var AdminCommentList = React.createClass({
    render: function() {
        var onDelete = this.props.onDelete;

        var comments = this.props.data.map(function (comment) {
            return (
                <AdminComment
                    key={comment.id}
                    id={comment.id}
                    author={comment.author}
                    article={comment.article}
                    content={comment.content}
                    onDelete={onDelete}
                />
            );
        });
        return (
            <table className="commentList">
            {comments}
            </table>
        )
    }
});


var AdminCommentBox = React.createClass({
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

    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function () {
        this.loadCommentsFromServer();
    },
    render: function () {
        return (
            <div>
                <h1>Comments</h1>
                    <AdminCommentList
                        data={this.state.data}
                        onDelete={this.deleteObj}
                    />
            </div>
        );
    }
});

var AdminCommentContainer = React.createClass({
    render: function() {
        return(
            <AdminCommentBox url="/comments.json" />
        )
    }
});







