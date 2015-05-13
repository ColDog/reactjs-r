class CommentSerializer < ActiveModel::Serializer
  attributes :id, :content, :author
end
