require 'test_helper'

class SessionsControllerTest < ActionController::TestCase
  test 'get login' do
    get :new
    assert_response :success
  end
end