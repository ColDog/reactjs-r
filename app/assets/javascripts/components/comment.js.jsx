var Comment = React.createClass({
    render: function () {
        return (
            <div className="comment">
                <h1>Comments</h1>
                <h2 className="commentAuthor">
          {this.props.author}
                </h2>
          {this.props.comment}
            </div>
        );
    }
});

var ready = function () {
    React.renderComponent(
        <Comment author="Richard" comment="This is a comment "/>,
        document.getElementById('comments')
    );
};