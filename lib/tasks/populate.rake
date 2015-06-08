namespace :db do
  task populate: :environment do

    Article.destroy_all

    20.times do
      Article.create(
        author: Faker::Name.name,
        title:  Faker::Name.name,
        body:   Faker::Lorem.words(200).join(' ')
      )
    end

    Comment.destroy_all

    10.times do
      Comment.create(
        author:   Faker::Name.name,
        content:  Faker::Lorem.words(10).join(' '),
        article_id: Article.find(rand(0..20)).id
      )
    end

  end
end