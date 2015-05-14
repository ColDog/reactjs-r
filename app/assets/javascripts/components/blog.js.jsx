/** @jsx React.DOM */


var BlogForm = React.createClass ({
    handleSubmit: function(e) {
        e.preventDefault();
        var title = React.findDOMNode(this.refs.title).value.trim();
        var body = React.findDOMNode(this.refs.body).value.trim();
        if (!title || !body) {
            return;
        }
        this.props.onBlogSubmit({title: title, body: body});
        React.findDOMNode(this.refs.title).value = '';
        React.findDOMNode(this.refs.body).value = '';
        return;
    },
    render: function() {
        return (
            <form className="blogForm" onSubmit={this.handleSubmit}>
                <input className="title" type="text" placeholder="Blog Title" ref="title" />
                <textarea type="text" placeholder="Say something..." ref="body" />
                <input className="btn" type="submit" value="Post" />
            </form>
        );
    }
});

var BlogList = React.createClass({
    render: function() {
        var blogNodes = this.props.data.map(function (blog) {
            return (
                <Post title={blog.title}>
                    {blog.body}
                </Post>
            );
        });
        return (
            <div className="blogList">
                {blogNodes}
            </div>
        );
    }
});


var Post = React.createClass({

    //getInitialState: function() {
    //    return { show: false };
    //},
    //expand: function () {
    //    this.setState({ show: true})
    //},
    //contract: function () {
    //    this.setState({ show: false})
    //},

    render: function() {
        var raw = marked(this.props.children.toString(), {sanitize: true})
        return(
            <div className="post">
                <h2 className="postTitle">{this.props.title}</h2>
                <div className="postBody" dangerouslySetInnerHTML={{__html: raw}} />
            </div>
        )
    }
});

var BlogBox = React.createClass({
    loadBlogsFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: true,
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    handleBlogSubmit: function(blog) {
        var blogs = this.state.data;
        var newBlogs = [blog].concat(blogs);
        this.setState({data: newBlogs});

        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            data: {article: blog},
            success: function(data) {
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadBlogsFromServer();
        setInterval(this.loadBlogsFromServer, this.props.pollInterval);
    },
    render: function() {
        return(
            <div className="blogBox">
                <BlogList data={this.state.data} />
                <div className="formBox">
                    <BlogForm onBlogSubmit={this.handleBlogSubmit()} />
                </div>
            </div>
        )
    }
});


var BlogContainer = React.createClass({
    render: function() {
        return(
            <BlogBox url="/articles.json" pollInterval={2000} />
        )
    }
});
