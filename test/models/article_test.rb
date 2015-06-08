require 'test_helper'

class ArticleTest < ActiveSupport::TestCase
  def setup
    @article = Article.new(
      title: 'Test Article',
      body: 'some body text'
    )
  end

  test 'article is valid' do
    assert @article.valid?, "#{@article.errors.full_messages}"
  end

  test 'article with no title' do
    @article.title = ''
    assert_not @article.valid?, "#{@article.errors.full_messages}"
  end

  test 'article with no body' do
    @article.body = ''
    assert_not @article.valid?, "#{@article.errors.full_messages}"
  end

end
