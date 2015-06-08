class Comment < ActiveRecord::Base
  belongs_to :article

  validates :author,      presence: true
  validates :content,     presence: true
  validates :article_id,  presence: true

end
