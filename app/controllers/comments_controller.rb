class CommentsController < ApplicationController
  before_action :logged_in_user, only: [:create, :destroy]
  respond_to :json

  def index
    respond_with Comment.all.includes(:article).reverse_order.to_json(include: [:article])
  end

  def create
    respond_with Comment.create!(comment_params)
  end

  def destroy
    respond_with Comment.find(params[:id]).destroy
  end

  private
    def comment_params
      params.require(:comment).permit(:author, :content, :article_id)
    end

end
