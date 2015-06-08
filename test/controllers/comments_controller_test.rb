require 'test_helper'

class CommentsControllerTest < ActionController::TestCase

  test 'get json at comments.json' do
    get :index, format: :json
    assert_response :success
  end

  test 'delete comments as admin' do
    log_in_as(admins(:one))
    assert_difference 'Comment.count', -1 do
      delete :destroy, id: comments(:one), format: :json
    end
  end

  test 'fail to delete comments as non-admin' do
    assert_difference 'Comment.count', 0 do
      delete :destroy, id: comments(:one), format: :json
    end
  end

end
