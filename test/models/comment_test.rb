require 'test_helper'

class CommentTest < ActiveSupport::TestCase

  def setup
    @comment = Comment.new(
      author: 'some author',
      content: 'some content',
      article_id: 1
    )
  end

  test 'comment is valid' do
    assert @comment.valid?, "#{@comment.errors.full_messages}"
  end

  test 'comment with no author' do
    @comment.author = ''
    assert_not @comment.valid?, "#{@comment.errors.full_messages}"
  end

  test 'comment with no content' do
    @comment.content = ''
    assert_not @comment.valid?, "#{@comment.errors.full_messages}"
  end

  test 'comment with no article' do
    @comment.article_id = ''
    assert_not @comment.valid?, "#{@comment.errors.full_messages}"
  end

end
