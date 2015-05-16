Admin.create!({username: 'admin', password: 'password', password_confirmation: 'password'})

Article.create!({title: 'A Test Article', body: 'Some Test content'})
Article.create!({title: 'A Test Article2', body: 'Some Test content'})
Article.create!({title: 'A Test Article3', body: 'Some Test content'})
Article.create!({title: 'A Test Article4', body: 'Some Test content'})
Article.create!({title: 'A Test Article5', body: 'Some Test content'})

Comment.create!({author: 'some fake author', content: 'Some fake content'})
Comment.create!({author: 'some fake author2', content: 'Some fake content'})
Comment.create!({author: 'some fake author3', content: 'Some fake content'})
Comment.create!({author: 'some fake author4', content: 'Some fake content'})
Comment.create!({author: 'some fake author5', content: 'Some fake content'})
Comment.create!({author: 'some fake author6', content: 'Some fake content'})
