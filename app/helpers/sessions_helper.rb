module SessionsHelper

  # Logs in the given user.
  def log_in(user)
    session[:user_id] = user.id
  end

  # creates the user session in cookies
  def remember(user)
    user.remember
    cookies.permanent.signed[:user_id] = user.id
    cookies.permanent[:remember_token] = user.remember_token
  end

  # returns current user
  def current_user
    @current_user ||= Admin.find_by(id: session[:user_id])
  end

  # Returns true if the user is logged in, false otherwise.
  def logged_in?
    !current_user.nil?
  end

  # forget a persistent session
  def forget(user)
    user.forget
    cookies.delete(:user_id)
    cookies.delete(:remember_token)
  end

  # logs out the current user
  def log_out
    session.delete(:user_id)
    @current_user = nil
  end

  # helper for logged in user
  def logged_in_user
    unless logged_in?
      flash[:danger] = 'Please Log In'
      redirect_to login_url
    end
  end

  # helper for logged in admin user
  def logged_in_admin
    unless current_user.admin?
      flash[:danger] = 'Please Log In'
      redirect_to login_url
    end
  end

  # checks if current user is the user argument
  def current_user?(user)
    user == current_user
  end

  # checks if user is correct
  def correct_user
    @user = Admin.find(params[:id])
    redirect_to(root_url) unless current_user?(@user) || current_user.admin
  end


end
