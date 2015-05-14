var Articles = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    body: React.PropTypes.node,
    author: React.PropTypes.string
  },

  render: function() {
    return (
      <div>
        <div>Title: {this.props.title}</div>
        <div>Body: {this.props.body}</div>
        <div>Author: {this.props.author}</div>
      </div>
    );
  }
});
