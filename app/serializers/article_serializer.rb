class ArticleSerializer < ActiveModel::Serializer
  attributes :id, :title, :body, :author, :created_at
end
