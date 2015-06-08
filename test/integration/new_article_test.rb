require 'test_helper'

class NewArticleTest < ActionDispatch::IntegrationTest

  test 'valid article submit' do
    log_in_as(admins(:one))
    assert_difference 'Article.count', +1 do
      post articles_path, article: {title: 'something', body: 'some text'}, format: :json
    end
    assert_response :success
  end

end
