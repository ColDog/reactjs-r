require 'test_helper'

class NewCommentTest < ActionDispatch::IntegrationTest

  test 'valid comment submit' do
    comment = Comment.new(author: 'an author', content: 'some content', article_id: 1)
    assert comment.valid?
    assert_difference 'Comment.count', +1 do
      post comments_path, comment: { author: 'an author', content: 'some content', article_id: articles(:one).id }, format: :json
    end
    assert_response :success, "#{response.status}"
  end

end
