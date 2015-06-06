Rails.application.routes.draw do
  root      'home#index'

  # Json Resources
  resources :articles, only: [:create, :index, :destroy, :update]
  resources :comments, only: [:create, :index, :destroy]

  # Admin Section
  get       'admin'   => 'admin#admin'
  get       'login'   => 'sessions#new'
  post      'login'   => 'sessions#create'
  delete    'logout'  => 'sessions#destroy'

end
