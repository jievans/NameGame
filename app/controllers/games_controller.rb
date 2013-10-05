class GamesController < ApplicationController
  def run
    if Rails.env.production?
      @app_id = "638116506222271"
    else
      @app_id = "400254313434669"
    end
  end
end
