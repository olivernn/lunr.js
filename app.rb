require 'rubygems'
require 'sinatra'

get "/" do
  erb :index
end

get "/tests" do
  erb :tests
end