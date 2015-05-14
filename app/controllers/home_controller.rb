class HomeController < ApplicationController
  def index
    @articles = Article.all.reverse_order
  end
end
