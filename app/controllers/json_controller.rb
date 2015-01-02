require "open-uri"

class JsonController < ApplicationController
  skip_before_action :verify_authenticity_token
  before_filter :auth_filter, :except=>[:login]
  after_filter :callback_wrapper #JSONP wrapper
  
  def login
    res = {:status=>"bad login"}
    if auth(params[:login], params[:password])
      res[:status]="ok"
      res[:user]=@user
    end
    
    render :json => res
  end
  
  def menu
    render :json => @user.role.lock
  end


  def callback_wrapper
    response.body = "#{params[:callback]}(#{response.body});" unless params[:callback].nil?
  end

  private

  def auth(login, password)
    logger.info "logging in #{login}"
    @user = User.find_by_login_and_password(login, password)
    if @user
      session[:user_id] = @user.id
      true
    else
      false
    end
  end

  def auth_filter
    logger.debug "="*40
    @user = User.find(session[:user_id]) unless session[:user_id].nil?
    if @user.nil? || @user.role.nil?
      @error="Please Login"
      render :json => {:status=>"bad request", :status_id=>500}
      return false
    end
    @account = @user.account
  end
  
  
  
end
