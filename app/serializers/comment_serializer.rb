class CommentSerializer < ActiveModel::Serializer
  attributes :id, :author, :content
end
