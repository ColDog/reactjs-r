require 'test_helper'

class ArticlesControllerTest < ActionController::TestCase

  test 'get json at articles.json' do
    get :index, format: :json
    assert_response :success
  end

  test 'admin can update articles' do
    log_in_as(admins(:one))
    patch :update, id: articles(:one).id, article: { title: 'new title', body: 'new body' } , format: :json
    assert_response :success
  end

  test 'non-admin cannot update articles' do
    patch :update, id: articles(:one).id, article: { title: 'new title', body: 'new body' } , format: :json
    assert_response :redirect
  end

  test 'admin can delete articles' do
    log_in_as(admins(:one))
    delete :destroy, id: articles(:one).id, format: :json
    assert_response :success
  end

  test 'non-admin cannot delete articles' do
    delete :destroy, id: articles(:one).id, format: :json
    assert_response :redirect
  end

end
