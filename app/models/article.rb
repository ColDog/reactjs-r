class Article < ActiveRecord::Base

  validates :title, presence: true
  validates :body, presence: true

  before_create :date_process

  private
    def date_process
      self.created_at.strftime('%B %d')
    end

end
