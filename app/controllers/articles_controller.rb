class ArticlesController < ApplicationController
  respond_to :json

  def index
    respond_with Article.all
  end

  def create
    respond_with Article.create!(article_params)
  end

  def destroy
    respond_with Article.find(params[:id]).destroy
  end

  private
  def article_params
    params.require(:article).permit(:title, :body)
  end

end
