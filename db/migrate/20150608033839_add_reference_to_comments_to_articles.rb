class AddReferenceToCommentsToArticles < ActiveRecord::Migration
  def change
    add_reference :articles, :comments, index: true
    add_foreign_key :articles, :comments
  end
end
