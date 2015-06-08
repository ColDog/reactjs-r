require 'test_helper'

class AdminControllerTest < ActionController::TestCase
  test 'redirect if not logged in' do
    get :admin
    assert_response :redirect
  end
  test 'should get admin' do
    log_in_as(admins(:one))
    get :admin
    assert_response :success
  end
end
