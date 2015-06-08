require 'test_helper'

class NewSessionTest < ActionDispatch::IntegrationTest

  test 'admin login and logout' do
    # login
    get login_path
    post login_path, session: { username: admins(:one).username, password: 'password' }
    assert !session[:user_id].nil?
    assert_redirected_to root_path

    # logout
    delete logout_path
    assert session[:user_id].nil?
    assert_redirected_to root_path
  end

end
