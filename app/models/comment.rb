class Comment < ActiveRecord::Base
  belongs_to :article

  validates :author, presence: true
  validates :content, presence: true

end
