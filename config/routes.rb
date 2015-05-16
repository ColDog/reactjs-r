Rails.application.routes.draw do

  # Comments
  root      'home#index'
  resources :articles
  resources :comments

  # Admin Section
  resources :sessions
  get 'admin' => 'admin#admin'
  get         'login'     => 'sessions#new'
  post        'login'     => 'sessions#create'
  delete      'logout'    => 'sessions#destroy'

end
