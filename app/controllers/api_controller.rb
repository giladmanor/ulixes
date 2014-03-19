require "tokenizer.rb"
class ApiController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :auth_filter, :except=>[:use_token]
  after_filter :callback_wrapper #JSONP wrapper
  
  SUCCESS = {:success=>true}
  FAIL = {:success=>false}
  
  def get_token
    #logger.debug generate_token(@user.id)
    render :json=> generate_token(@user.id)
  end
  
  def use_token
    unless validate_token(params[:t])
      render :file => '/public/404.html', :status => :not_found, :layout => false
      return false
    else
      render :json=> params[:with_info].present? ? @user.spill : SUCCESS
    end
  end
  
  def create
    if @user.nil? && @account.add_user(uid:params[:uid])
      render :json=> SUCCESS
    else
      render :json=> FAIL
    end
  end
  
  def get
    render :json=> @user.spill
  end
  
  def set
    @user.resolve_event params[:code],params[:value]
    render :json=> params[:with_info].present? ? @user.spill : SUCCESS
  end
  
  def read
    un = @user.user_notifications.find(params[:id])
    un.read = Time.now
    un.save
    render :json=> params[:with_info].present? ? @user.spill : SUCCESS
  end
  
  private # private # private # private # private # private # private # private # private # private # 
  
  # FILTER
  def auth_filter
    unless session[:uuid]
      @account = Account.find(params[:a_id])
      unless params[:k]==@account.key || params[:k]==@account.client_key
        render :file => 'public/404.html', :status => :not_found, :layout => false
        return false
      end
      @user = @account.find_user(params[:uuid])
    else
      @user = User.find(session[:uuid])
      @account = @user.account
    end
  end
  
  def load_account(account_id)
    @account = Account.find(account_id)
  end
  
  # FILTER
  def callback_wrapper
    response.body = "#{params[:callback]}(#{response.body});" unless params[:callback].nil?
  end
  
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
