require "breaker/web/version"

require 'sinatra'

module Breaker
  class Dashboard < Sinatra::Base
    set :root, "#{File.dirname(__FILE__)}/web/dashboard"

    get '/' do
      erb :dashboard
    end
  end
end
