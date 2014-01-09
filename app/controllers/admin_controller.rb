class AdminController < ApplicationController
  before_filter :auth_filter, :except=>[:login]
  

  def login
    if auth(params[:login], params[:password])
      redirect_to action:"index" 
      return 
    end
    logger.debug "XXX"
    render "login", :layout=>false
  end
  
  def logout
    session[:user_id] = nil
    render "login", :layout=>false
  end
  

  def index
  
  end
  
  private
  
  def auth(login, password)
    logger.info "logging in #{login}"
    user = User.find_by_login_and_password(login, password)
    if user
      
      session[:user_id] = user.id 
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
      render "login", :layout=>false
      return false
    end
    @account = @user.account
  end
  
end
