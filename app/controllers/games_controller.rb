class GamesController < ApplicationController
  def run
    if Rails.env.production?
      @app_id = "638116506222271"
      @host = request.host
    else
      @app_id = "400254313434669"
      @host= "localhost:3000"
    end
    
    
  end
end
