class ArticlesController < ApplicationController
  before_action :logged_in_user, only: [:create, :destroy]
  respond_to :json

  def index
    respond_with Article.all.includes(:comments).reverse_order.to_json(include: [:comments])
  end

  def create
    respond_with Article.create!(article_params)
  end

  def update
    respond_with Article.find(params[:id]).update!(article_params)
  end

  def destroy
    respond_with Article.find(params[:id]).destroy
  end

  private
  def article_params
    params.require(:article).permit(:id, :title, :body)
  end

end
