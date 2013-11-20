class AdminController < ApplicationController
  before_filter :auth_filter, :except=>[:login]
  before_filter :menu_filer

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
  
  def menu_filer
    session[:open_menu] = params[:open_menu] if params[:open_menu].present?
  end
  
  def auth_filter
    logger.debug "="*40
    @user = User.find(session[:user_id]) unless session[:user_id].nil? 
    unless @user
      @error="Please Login"
      render "login", :layout=>false
      return false
    end
    @account = @user.account
  end
  
end
