NameGame::Application.routes.draw do
  get "games/run"

  root :to => "games#run"
end
