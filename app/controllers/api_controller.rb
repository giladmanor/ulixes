require "tokenizer.rb"
class ApiController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :auth_filter, :except=>[:use_token]
  after_filter :callback_wrapper #JSONP wrapper
  
  SUCCESS = {:success=>true}
  FAIL = {:success=>false}
    
  # Server to Server API # Server to Server API # Server to Server API # Server to Server API 
  
  def get_token
    #logger.debug generate_token(@user.id)
    render :json=> generate_token(@user.id)
  end
  
  def create
    if @user.nil? && @account.add_user(uid:params[:uid])
      render :json=> SUCCESS
    else
      render :json=> FAIL
    end
  end
    
  # General API # General API # General API # General API # General API # General API
  def use_token
    unless validate_token(params[:t])
      render :file => '/public/404.html', :status => :not_found, :layout => false
      return false
    else
      render :json=> params[:with_info].present? ? @user.spill : SUCCESS
    end
  end
     
  def get 
    @user.resolve_event(params[:code],params[:value]) if params[:code].present?
    @user.append_data(params[:user]) if params[:user].present?
    render :json=> @user.spill!
  end
  
  def set 
    @user.resolve_event params[:code],params[:value] unless params[:code].empty?
    render :json=> params[:with_info].present? ? @user.spill : SUCCESS
  end
  
  def read
    un = @user.respond_to_notification(params[:id])
    render :json=> params[:with_info].present? ? @user.spill : SUCCESS
  end
  
  def cta
    logger.debug "#"*150
    un = @user.respond_to_notification(params[:notification_id],clean_up(params))
    render :json=> params[:with_info].present? ? @user.spill : SUCCESS
  end
  
  private # private # private # private # private # private # private # private # private # private # 
  
  def clean_up(params)
    res = {}
    params.each{|k,v|
      res[k]=v unless ["a_id","k","action","controller","uuid","with_info", "notification_id"].include?(k)
    }
    res
  end
  
  
  # FILTER
  def auth_filter
    logger.debug ["----",request.remote_ip,"----"].join("|")
    
    if params[:a_id].present?
      @account = Account.find(params[:a_id])
      unless params[:k]==@account.key || params[:k]==@account.client_key
        render :file => 'public/404.html', :status => :not_found, :layout => false
        return false
      end
      logger.debug "!"*50 unless params[:uuid].present? && session[:uuid].nil?
      @user = @account.find_user(params[:uuid] || session[:uuid] || request.remote_ip)
    else
      logger.warn "X"*40
      logger.warn "reject user from #{request.remote_ip}"
      logger.warn "X"*40
      render :file => 'public/404.html', :status => :not_found, :layout => false
      return false
      # @user = User.find(session[:uuid] )
      # @account = @user.account
    end
  end
  
  def load_account(account_id)
    @account = Account.find(account_id)
  end
  
  # FILTER
  def callback_wrapper
    response.body = "#{params[:callback]}(#{response.body});" unless params[:callback].nil?
  end
  
  # Tokenizer Instrumentation
  def generate_token(uuid)
    Tokenizer.get_token(uuid)
  end
  
  def validate_token(token_id)
    uuid = Tokenizer.use_token token_id
    logger.debug "#"*10 + uuid.inspect
    session[:uuid] = uuid
    @user = User.find(session[:uuid]) unless uuid.nil?
  end

end
