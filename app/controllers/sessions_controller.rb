class SessionsController < ApplicationController
  def new
  end

  def create
    user = Admin.find_by(username: params[:session][:username])
    if user && user.authenticate(params[:session][:password])
      flash[:success] = 'Successfully Logged In'
      log_in user
      redirect_to root_url
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
end
