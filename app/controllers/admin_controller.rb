require "open-uri"

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

  def configuration

  end
  
  def creator
    
  end

  def create_account
    account = Account.create({:name=>params[:name]})
    role_lock = [
      {:name=>"Account", :items=>[{:name=>"Configuration", :uri=>"/config"}, {:name=>"Roles", :uri=>"/list/role"}, {:name=>"Languages", :uri=>"/list/language"}]}, 
      {:name=>"Assets", :items=>[{:name=>"Badges", :uri=>"/grid/badge"}, {:name=>"Scales", :uri=>"/list/scale"}, {:name=>"Notifications", :uri=>"/list/notification"}]}, 
      {:name=>"Marketing Flow", :items=>[{:name=>"Rules", :uri=>"/graph/index"}, {:name=>"Visuals", :uri=>"/visual_aid/index"}]}
      ]
    role = Role.create({:account=> account, :name=> "tech", :code=> "tech", :lock=> role_lock})
    User.create({ :account=> account, :role=> role, :uid=> nil, :login=>params[:login], :password=> params[:password]})
    Node.create({:name=>"Starting Point",:account=>account})
    Language.create({:name=>"English", :code=>"en", :account=>account})
    render :json=>{:ok=>true}
  end

  def get_client_tracker
    uri = "https://raw2.github.com/giladmanor/ulixes-sdk/master/ulixes_tracker_mini.js"
    file = open(uri).read
    logger.debug file
    render :inline=>file.gsub("[SERVER]","#{request.protocol}#{request.host}:#{request.port.to_s}").gsub("[ACCOUNTID]",@account.id.to_s).gsub("[ACCOUNTCLIENTKEY]",@account.client_key)
  end

  def update_account
    @account.name=params[:name]
    @account.key=params[:key]
    @account.client_key=params[:client_key]

    @account.conf = params[:conf]
    @account.save
    redirect_to action:"configuration"
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
