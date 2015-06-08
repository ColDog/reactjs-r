class AddArticleReferenceToComments < ActiveRecord::Migration
  def change
    add_reference :comments, :article, index: true
    add_foreign_key :comments, :articles
  end
end
