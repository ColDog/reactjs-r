class CommentsController < ApplicationController
  respond_to :json

  def index
    respond_with Comment.all.reverse_order
  end

  def create
    respond_with Comment.create!(comment_params)
  end

  def destroy
    respond_with Comment.find(params[:id]).destroy
  end

  private
    def comment_params
      params.require(:comment).permit(:author, :content)
    end

end
